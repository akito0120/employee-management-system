import { z } from 'zod';

export const registerPositionRequest = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  description: z.string().nullish(),
  initialSalary: z.int().positive(),
  raiseAmount: z.int().positive(),
  raiseCount: z.int().positive(),
  grade: z.int().refine((grade: number) => 1 <= grade && grade <= 12),
  id: z.number().nullish()
});

export type RegisterPositionRequest = z.infer<typeof registerPositionRequest>;
