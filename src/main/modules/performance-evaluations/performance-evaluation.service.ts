import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import {
  FindPerformanceEvaluationRequest,
  FindPerformanceEvaluationResponse
} from '../../../shared/dto/performance-evaluations/find-performance-evaluation.dto';
import { FindPerformanceEvaluationByIdResponse } from '../../../shared/dto/performance-evaluations/find-performance-evaluation-by-id.dto';
import { RegisterPerformanceEvaluationRequest } from '../../../shared/dto/performance-evaluations/register-performance-evaluation.dto';
import { DatabaseType } from '../../db';
import { performanceEvaluations } from '../../db/schema';

@injectable()
export class PerformanceEvaluationService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
  }

  async registerPerformanceEvaluation(req: RegisterPerformanceEvaluationRequest) {
    await this.db.insert(performanceEvaluations).values({ ...req, evaluatedAt: new Date() });
  }

  async findPerformanceEvaluation(
    req: FindPerformanceEvaluationRequest
  ): Promise<FindPerformanceEvaluationResponse> {
    const where = and(
      ...(req.title ? [like(performanceEvaluations.title, `%${req.title}%`)] : []),
      ...(req.evaluatorEmployeeId
        ? [eq(performanceEvaluations.evaluatorEmployeeId, req.evaluatorEmployeeId)]
        : []),
      ...(req.evaluatedEmployeeId
        ? [eq(performanceEvaluations.evaluatedEmployeeId, req.evaluatedEmployeeId)]
        : [])
    );

    const items = await this.db.query.performanceEvaluations.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10,
      with: {
        evaluatorEmployee: { columns: { id: true, firstName: true, lastName: true, code: true } },
        evaluatedEmployee: { columns: { id: true, firstName: true, lastName: true, code: true } }
      }
    });

    const total = await this.db.$count(performanceEvaluations, where);

    return {
      total,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        evaluatedAt: item.evaluatedAt,
        evaluatorEmployee: {
          ...item.evaluatorEmployee
        },
        evaluatedEmployee: {
          ...item.evaluatedEmployee
        }
      }))
    };
  }

  async findPerformanceEvaluationById(id: number): Promise<FindPerformanceEvaluationByIdResponse> {
    const evaluation = await this.db.query.performanceEvaluations.findFirst({
      where: eq(performanceEvaluations.id, id),
      with: {
        evaluatorEmployee: { columns: { id: true, firstName: true, lastName: true, code: true } },
        evaluatedEmployee: { columns: { id: true, firstName: true, lastName: true, code: true } }
      }
    });

    if (!evaluation) throw new Error('No such performance evaluation');

    return {
      id: evaluation.id,
      title: evaluation.title,
      score: evaluation.score,
      description: evaluation.description,
      evaluatedAt: evaluation.evaluatedAt,
      evaluator: evaluation.evaluatorEmployee,
      evaluated: evaluation.evaluatedEmployee
    };
  }
}
