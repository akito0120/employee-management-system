import { z } from 'zod';

export const registerPerformanceEvaluationRequest = z.object({
  evaluatorEmployeeId: z.number(),
  evaluatedEmployeeId: z.number(),
  title: z.string().nonempty(),
  score: z.string().nonempty(),
  description: z.string().nonempty()
});

export type RegisterPerformanceEvaluationRequest = z.infer<
  typeof registerPerformanceEvaluationRequest
>;
