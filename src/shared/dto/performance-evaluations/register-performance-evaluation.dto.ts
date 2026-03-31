import { z } from 'zod';

export const registerPerformanceEvaluationRequest = z
  .object({
    evaluatorEmployeeId: z.number(),
    evaluatedEmployeeId: z.number(),
    title: z.string().nonempty(),
    score: z.string().nonempty(),
    description: z.string().nonempty()
  })
  .superRefine((value, ctx) => {
    if (value.evaluatedEmployeeId === value.evaluatorEmployeeId)
      ctx.addIssue('Evaluator and evaluated employee cannot be the same');
  });

export type RegisterPerformanceEvaluationRequest = z.infer<
  typeof registerPerformanceEvaluationRequest
>;
