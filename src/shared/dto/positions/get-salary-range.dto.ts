import { z } from 'zod';

import { jobGradeLevel } from '../../../main/db/schema';

export const getSalaryRangeRequest = z.object({
  positionId: z.coerce.number(),
  jobGradeLevel: z.enum(jobGradeLevel)
});

export const getSalaryRangeResponse = z.object({
  min: z.number(),
  max: z.number()
});

export type GetSalaryRangeRequest = z.infer<typeof getSalaryRangeRequest>;
export type GetSalaryRangeResponse = z.infer<typeof getSalaryRangeResponse>;
