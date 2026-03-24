import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { GetOptionsResponse } from '../../../shared/dto/get-options.dto';
import {
  FindPositionRequest,
  FindPositionResponse
} from '../../../shared/dto/positions/find-position.dto';
import { GetJobGradeLevelOptionsRequest } from '../../../shared/dto/positions/get-job-grade-level-options.dto';
import {
  GetSalaryRangeRequest,
  GetSalaryRangeResponse
} from '../../../shared/dto/positions/get-salary-range.dto';
import { RegisterPositionRequest } from '../../../shared/dto/positions/register-positions.dto';
import { DatabaseType } from '../../db';
import { jobGradeLevel, jobGrades, NewJobGrade, NewPosition, positions } from '../../db/schema';
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

  async getJobGradeLevelOptions(req: GetJobGradeLevelOptionsRequest): Promise<GetOptionsResponse> {
    if (!req.positionId) return jobGradeLevel.map((value) => ({ label: value, value }));

    const grades = await this.db.query.jobGrades.findMany({
      where: eq(jobGrades.positionId, req.positionId),
      columns: { level: true }
    });

    return grades.map((grade) => ({ label: grade.level, value: grade.level }));
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
        name: pos.name
      }))
    };
  }

  async getPositionOptions(): Promise<GetOptionsResponse> {
    const positions = await this.db.query.positions.findMany({ columns: { id: true, name: true } });
    return positions.map((pos) => ({ label: pos.name, value: pos.id }));
  }

  async getSalaryRange(req: GetSalaryRangeRequest): Promise<GetSalaryRangeResponse> {
    const jobGrade = await this.db.query.jobGrades.findFirst({
      where: and(eq(jobGrades.positionId, req.positionId), eq(jobGrades.level, req.jobGradeLevel))
    });

    if (!jobGrade) throw new Error();
    return { min: jobGrade.minSalary, max: jobGrade.maxSalary };
  }
}
