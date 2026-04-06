import { z } from 'zod';

export const findPerformanceEvaluationRequest = z.object({
  page: z.int().positive(),
  title: z.string().nullish(),
  evaluatorEmployee: z.string().nullish(),
  evaluatedEmployee: z.string().nullish()
});

export const findPerformanceEvaluationResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      evaluatorEmployee: z.string(),
      evaluatedEmployee: z.string(),
      evaluatedAt: z.date()
    })
  )
});

export type FindPerformanceEvaluationRequest = z.infer<typeof findPerformanceEvaluationRequest>;
export type FindPerformanceEvaluationResponse = z.infer<typeof findPerformanceEvaluationResponse>;
