import { and, eq, like } from 'drizzle-orm';
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

@injectable()
export class PositionService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
  }

  async registerPosition(req: RegisterPositionRequest): Promise<void> {
    const newPosition: NewPosition = {
      name: req.name,
      code: req.code,
      description: req.description,
      initialSalary: req.initialSalary,
      raiseAmount: req.raiseAmount,
      timeInRole: req.timeInRole,
      grade: req.grade
    };

    await this.db.insert(positions).values(newPosition);
  }

  async findPosition(req: FindPositionRequest): Promise<FindPositionResponse> {
    const where = and(
      ...(req.name ? [like(positions.name, `%${req.name}%`)] : []),
      ...(req.code ? [like(positions.code, `%%${req.code}`)] : [])
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
      timeInRole: pos.timeInRole
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
}
