import { z } from 'zod';

export const findPerformanceEvaluationByIdResponse = z.object({
  id: z.number(),
  title: z.string(),
  score: z.string(),
  description: z.string(),
  evaluatedAt: z.date(),
  evaluator: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    code: z.string()
  }),
  evaluated: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    code: z.string()
  })
});

export type FindPerformanceEvaluationByIdResponse = z.infer<
  typeof findPerformanceEvaluationByIdResponse
>;
