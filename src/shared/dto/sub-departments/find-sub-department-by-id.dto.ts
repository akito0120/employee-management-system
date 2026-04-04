import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findSubDepartmentByIdResponse = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullable(),
  departmentId: z.number()
});

export type FindSubDepartmentByIdResponse = z.infer<typeof findSubDepartmentByIdResponse>;
