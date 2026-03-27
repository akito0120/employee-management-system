import { z } from 'zod';

export const getPositionOptionsRequest = z.object({
  grade: z.int().nullish()
});

export type GetPositionOptionsRequest = z.infer<typeof getPositionOptionsRequest>;
