import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { FindCommendationByIdResponse } from '../../../shared/dto/commendations/find-commendatio-by-id.dto';
import {
  FindCommendationRequest,
  FindCommendationResponse
} from '../../../shared/dto/commendations/find-commendation.dto';
import { IssueCommendationRequest } from '../../../shared/dto/commendations/issue-commendation.dto';
import { DatabaseType } from '../../db';
import {
  commendations,
  employeeCommendations,
  NewCommendation,
  NewEmployeeCommendation
} from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class CommendationService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  async issueCommendation(req: IssueCommendationRequest): Promise<void> {
    const newCommendation: NewCommendation = {
      title: req.title,
      description: req.description,
      adjustment: req.adjustment,
      category: req.category,
      issuedAt: new Date()
    };

    const result = await this.db.insert(commendations).values(newCommendation);

    const emplCommendations: NewEmployeeCommendation[] = req.employeeIds.map((id) => ({
      employeeId: id,
      commendationId: result.lastInsertRowid as number
    }));

    await this.db.insert(employeeCommendations).values(emplCommendations);

    const newValue = await this.db.query.commendations.findFirst({
      where: eq(commendations.id, result.lastInsertRowid as number),
      with: { employeeCommendations: true }
    });

    this.logService.log({
      category: 'CREATE',
      target: 'COMMENDATION',
      targetId: result.lastInsertRowid as number,
      newValue: JSON.stringify(newValue, null, 2)
    });
  }

  async findCommendation(req: FindCommendationRequest): Promise<FindCommendationResponse> {
    const where = and(
      ...(req.title ? [like(commendations.title, `%${req.title}%`)] : []),
      ...(req.category ? [eq(commendations.category, req.category)] : [])
    );

    const comm = await this.db.query.commendations.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10
    });

    const total = await this.db.$count(commendations, where);

    return {
      total,
      items: comm.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        adjustment: item.adjustment,
        issuedAt: item.issuedAt
      }))
    };
  }

  async findCommendationById(id: number): Promise<FindCommendationByIdResponse> {
    const commendation = await this.db.query.commendations.findFirst({
      where: eq(commendations.id, id),
      with: {
        employeeCommendations: {
          with: { employee: { columns: { id: true, firstName: true, lastName: true, code: true } } }
        }
      }
    });

    if (!commendation) throw new Error('No such commendation');

    return {
      id: commendation.id,
      title: commendation.title,
      description: commendation.description,
      adjustment: commendation.adjustment,
      category: commendation.category,
      issuedAt: commendation.issuedAt,
      employees: commendation.employeeCommendations.map((item) => item.employee)
    };
  }
}
