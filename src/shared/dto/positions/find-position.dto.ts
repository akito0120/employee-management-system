import { z } from 'zod';

export const findPositionRequest = z.object({
  page: z.coerce.number(),
  name: z.string().nullish(),
  code: z.string().nullish(),
  grades: z.array(z.number()).nullish()
});

export const findPositionResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      code: z.string(),
      grade: z.int()
    })
  )
});

export type FindPositionRequest = z.infer<typeof findPositionRequest>;
export type FindPositionResponse = z.infer<typeof findPositionResponse>;
