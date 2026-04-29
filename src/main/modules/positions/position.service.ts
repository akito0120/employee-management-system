import { and, eq, inArray, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { GetOptionsResponse } from '../../../shared/dto/get-options.dto';
import {
  FindPositionRequest,
  FindPositionResponse
} from '../../../shared/dto/positions/find-position.dto';
import { FindPositionByIdResponse } from '../../../shared/dto/positions/find-position-by-id.dto';
import { GetPositionOptionsRequest } from '../../../shared/dto/positions/get-position-options.dto';
import { RegisterPositionRequest } from '../../../shared/dto/positions/register-positions.dto';
import { DatabaseType } from '../../db';
import { NewPosition, positions } from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class PositionService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  async registerPosition(req: RegisterPositionRequest): Promise<void> {
    const id = req.id;

    if (id === null || id === undefined) {
      this.db.transaction((tx) => {
        const newPosition: NewPosition = {
          name: req.name,
          code: req.code,
          description: req.description,
          initialSalary: req.initialSalary,
          raiseAmount: req.raiseAmount,
          raiseCount: req.raiseCount,
          grade: req.grade
        };

        const result = tx.insert(positions).values(newPosition).run();

        const newValue = tx.query.positions
          .findFirst({
            where: eq(positions.id, result.lastInsertRowid as number)
          })
          .sync();

        this.logService.log({
          tx,
          category: 'CREATE',
          target: 'POSITION',
          targetId: result.lastInsertRowid as number,
          newValue: JSON.stringify(newValue, null, 2)
        });
      });
    } else {
      this.db.transaction((tx) => {
        const where = eq(positions.id, id);
        const oldValue = tx.query.positions.findFirst({ where }).sync();

        tx.update(positions)
          .set({
            name: req.name,
            code: req.code,
            grade: req.grade,
            initialSalary: req.initialSalary,
            raiseAmount: req.raiseAmount,
            raiseCount: req.raiseCount,
            description: req.description
          })
          .where(eq(positions.id, id))
          .run();

        const newValue = tx.query.positions.findFirst({ where }).sync();

        this.logService.log({
          tx,
          category: 'EDIT',
          target: 'POSITION',
          targetId: id,
          oldValue: JSON.stringify(oldValue, null, 2),
          newValue: JSON.stringify(newValue, null, 2)
        });
      });
    }
  }

  async findPosition(req: FindPositionRequest): Promise<FindPositionResponse> {
    const where = and(
      ...(req.name ? [like(positions.name, `%${req.name}%`)] : []),
      ...(req.code ? [like(positions.code, `%%${req.code}`)] : []),
      ...(req.grades && req.grades.length > 0 ? [inArray(positions.grade, req.grades)] : [])
    );

    const positionList = await this.db.query.positions.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10
    });

    const total = await this.db.$count(positions, where);

    return {
      total,
      items: positionList.map((pos) => ({
        id: pos.id,
        code: pos.code,
        name: pos.name,
        grade: pos.grade
      }))
    };
  }

  async findPositionById(id: number): Promise<FindPositionByIdResponse> {
    const pos = await this.db.query.positions.findFirst({ where: eq(positions.id, id) });
    if (!pos) throw new Error('No position was found');

    return {
      id: pos.id,
      name: pos.name,
      code: pos.code,
      description: pos.description,
      grade: pos.grade,
      initialSalary: pos.initialSalary,
      raiseAmount: pos.raiseAmount,
      raiseCount: pos.raiseCount
    };
  }

  async getPositionOptions(req: GetPositionOptionsRequest): Promise<GetOptionsResponse> {
    const where = req.grade ? eq(positions.grade, req.grade) : undefined;
    const pos = await this.db.query.positions.findMany({
      where,
      columns: { id: true, name: true, grade: true }
    });

    return pos.map((pos) => ({ label: `${pos.name} (G${pos.grade})`, value: pos.id }));
  }

  async deletePositionById(id: number) {
    const where = eq(positions.id, id);
    const oldValue = await this.db.query.positions.findFirst({ where });

    await this.db.delete(positions).where(where);

    this.logService.log({
      category: 'DELETE',
      target: 'POSITION',
      targetId: id,
      oldValue: JSON.stringify(oldValue, null, 2)
    });
  }
}
