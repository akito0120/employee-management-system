import { z } from 'zod';

export const registerPositionRequest = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  description: z.string().nullish(),
  initialSalary: z.int().positive(),
  raiseAmount: z.int().positive(),
  timeInRole: z.int().positive().nullish(),
  grade: z.int().refine((grade: number) => 1 <= grade && grade <= 12)
});

export type RegisterPositionRequest = z.infer<typeof registerPositionRequest>;
