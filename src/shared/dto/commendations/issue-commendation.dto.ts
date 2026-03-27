import { z } from 'zod';

import { commendationCategories } from '../../../main/db/schema';

export const issueCommendationRequest = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  adjustment: z.int().positive(),
  category: z.enum(commendationCategories),
  employeeIds: z
    .array(z.number())
    .min(1)
    .refine((items) => new Set(items).size === items.length, {
      message: 'Each employee can be selected only once'
    })
});

export type IssueCommendationRequest = z.infer<typeof issueCommendationRequest>;
