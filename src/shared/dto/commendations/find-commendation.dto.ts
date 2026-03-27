import { z } from 'zod';

import { commendationCategories } from '../../../main/db/schema';

export const findCommendationRequest = z.object({
  title: z.string().nullish(),
  category: z.enum(commendationCategories).nullish(),
  page: z.number()
});

export const findCommendationResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      adjustment: z.number(),
      category: z.enum(commendationCategories),
      issuedAt: z.date()
    })
  )
});

export type FindCommendationRequest = z.infer<typeof findCommendationRequest>;
export type FindCommendationResponse = z.infer<typeof findCommendationResponse>;
