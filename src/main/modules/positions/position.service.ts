import { container, injectable } from 'tsyringe';

import { RegisterPositionRequest } from '../../../shared/dto/positions/register-positions.dto';
import { DatabaseType } from '../../db';
import { jobGrades, NewJobGrade, NewPosition, positions } from '../../db/schema';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class PositionService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async registerPosition(req: RegisterPositionRequest): Promise<void> {
    const newPosition: NewPosition = {
      name: req.name,
      code: req.code,
      description: req.description
    };
    const { lastInsertRowid: positionId } = await this.db.insert(positions).values(newPosition);

    const newJobGrades: NewJobGrade[] = req.jobGrades.map((grade) => ({
      level: grade.level,
      minSalary: grade.minSalary,
      maxSalary: grade.maxSalary,
      timeInRole: grade.timeInRole,
      description: grade.description,
      headcount: grade.headcount,
      positionId: positionId as number
    }));

    await this.db.insert(jobGrades).values(newJobGrades);
  }
}
