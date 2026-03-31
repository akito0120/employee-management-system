import { container } from 'tsyringe';

import { findPerformanceEvaluationRequest } from '../../../shared/dto/performance-evaluations/find-performance-evaluation.dto';
import { registerPerformanceEvaluationRequest } from '../../../shared/dto/performance-evaluations/register-performance-evaluation.dto';
import t from '../../trpc';
import { PerformanceEvaluationService } from './performance-evaluation.service';

const performanceEvaluationRouter = t.router({
  registerPerformanceEvaluation: t.procedure
    .input(registerPerformanceEvaluationRequest)
    .mutation(async (c) => {
      const service = container.resolve(PerformanceEvaluationService);
      await service.registerPerformanceEvaluation(c.input);
    }),
  findPerformanceEvaluation: t.procedure
    .input(findPerformanceEvaluationRequest)
    .query(async (c) => {
      const service = container.resolve(PerformanceEvaluationService);
      return await service.findPerformanceEvaluation(c.input);
    })
});

export default performanceEvaluationRouter;
