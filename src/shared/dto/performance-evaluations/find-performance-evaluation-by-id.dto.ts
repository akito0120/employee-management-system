import { z } from 'zod';

export const findPerformanceEvaluationByIdResponse = z.object({
  id: z.number(),
  title: z.string(),
  score: z.string(),
  description: z.string(),
  evaluatedAt: z.date(),
  evaluatorEmployee: z.string(),
  evaluatedEmployee: z.string()
});

export type FindPerformanceEvaluationByIdResponse = z.infer<
  typeof findPerformanceEvaluationByIdResponse
>;
