import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findUnitByIdResponse = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullable(),
  subDepartmentId: z.number()
});

export type FindUnitByIdResponse = z.infer<typeof findUnitByIdResponse>;
