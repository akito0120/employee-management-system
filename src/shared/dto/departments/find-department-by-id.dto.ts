import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findDepartmentByIdResponse = z.object({
  name: z.string(),
  id: z.number(),
  code: z.string(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullable()
});

export type FindDepartmentByIdResponse = z.infer<typeof findDepartmentByIdResponse>;
