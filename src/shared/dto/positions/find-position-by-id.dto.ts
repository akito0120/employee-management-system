import { z } from 'zod';

export const findPositionByIdResponse = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  initialSalary: z.number(),
  raiseAmount: z.number(),
  timeInRole: z.number().nullable(),
  grade: z.number()
});

export type FindPositionByIdResponse = z.infer<typeof findPositionByIdResponse>;
