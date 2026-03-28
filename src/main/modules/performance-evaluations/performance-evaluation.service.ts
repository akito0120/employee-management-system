import { container, injectable } from 'tsyringe';

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
}
