import { z } from 'zod';

import { commendationCategories } from '../../../main/db/schema';

export const findCommendationByIdResponse = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  adjustment: z.number(),
  issuedAt: z.date(),
  category: z.enum(commendationCategories),
  employees: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      code: z.string()
    })
  )
});

export type FindCommendationByIdResponse = z.infer<typeof findCommendationByIdResponse>;
