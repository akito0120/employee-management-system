import { z } from 'zod';

export const findPerformanceEvaluationRequest = z.object({
  page: z.int().positive(),
  title: z.string().nullish(),
  evaluatorEmployeeId: z.number().nullish(),
  evaluatedEmployeeId: z.number().nullish()
});

export const findPerformanceEvaluationResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      title: z.string(),
      evaluatorEmployee: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        code: z.string()
      }),
      evaluatedEmployee: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        code: z.string()
      }),
      evaluatedAt: z.date()
    })
  )
});

export type FindPerformanceEvaluationRequest = z.infer<typeof findPerformanceEvaluationRequest>;
export type FindPerformanceEvaluationResponse = z.infer<typeof findPerformanceEvaluationResponse>;
