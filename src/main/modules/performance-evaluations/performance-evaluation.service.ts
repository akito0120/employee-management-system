import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import {
  FindPerformanceEvaluationRequest,
  FindPerformanceEvaluationResponse
} from '../../../shared/dto/performance-evaluations/find-performance-evaluation.dto';
import { FindPerformanceEvaluationByIdResponse } from '../../../shared/dto/performance-evaluations/find-performance-evaluation-by-id.dto';
import { RegisterPerformanceEvaluationRequest } from '../../../shared/dto/performance-evaluations/register-performance-evaluation.dto';
import { DatabaseType } from '../../db';
import { employees, NewPerformanceEvaluation, performanceEvaluations } from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class PerformanceEvaluationService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  async registerPerformanceEvaluation(req: RegisterPerformanceEvaluationRequest) {
    const evaluator = await this.db.query.employees.findFirst({
      where: eq(employees.id, req.evaluatorEmployeeId),
      columns: { firstName: true, lastName: true, code: true }
    });
    const evaluated = await this.db.query.employees.findFirst({
      where: eq(employees.id, req.evaluatedEmployeeId),
      columns: { firstName: true, lastName: true, code: true }
    });

    if (!evaluator || !evaluated) throw new Error('No such employee');

    const today = new Date();
    const values: NewPerformanceEvaluation = {
      title: req.title,
      score: req.score,
      description: req.description,
      evaluatedAt: today,
      evaluatorEmployee: `${evaluator.firstName} ${evaluator.lastName} (${evaluator.code})`,
      evaluatedEmployee: `${evaluated.firstName} ${evaluated.lastName} (${evaluated.code})`
    };

    const result = await this.db.insert(performanceEvaluations).values(values);

    const newValue = await this.db.query.performanceEvaluations.findFirst({
      where: eq(performanceEvaluations.id, result.lastInsertRowid as number)
    });

    this.logService.log({
      category: 'CREATE',
      target: 'PERFORMANCE_EVALUATION',
      targetId: result.lastInsertRowid as number,
      newValue: JSON.stringify(newValue, null, 2)
    });
  }

  async findPerformanceEvaluation(
    req: FindPerformanceEvaluationRequest
  ): Promise<FindPerformanceEvaluationResponse> {
    const where = and(
      ...(req.title ? [like(performanceEvaluations.title, `%${req.title}%`)] : []),
      ...(req.evaluatorEmployee
        ? [like(performanceEvaluations.evaluatorEmployee, `%${req.evaluatorEmployee}%`)]
        : []),
      ...(req.evaluatedEmployee
        ? [like(performanceEvaluations.evaluatedEmployee, `%${req.evaluatedEmployee}%`)]
        : [])
    );

    const items = await this.db.query.performanceEvaluations.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10
    });

    const total = await this.db.$count(performanceEvaluations, where);

    return { total, items };
  }

  async findPerformanceEvaluationById(id: number): Promise<FindPerformanceEvaluationByIdResponse> {
    const evaluation = await this.db.query.performanceEvaluations.findFirst({
      where: eq(performanceEvaluations.id, id)
    });

    if (!evaluation) throw new Error('No such performance evaluation');
    return evaluation;
  }
}
