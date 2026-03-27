import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

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

@injectable()
export class CommendationService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
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
}
