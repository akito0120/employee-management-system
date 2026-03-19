import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findDepartmentRequest = z.object({
  name: z.string().nullable(),
  departmentCode: z.string().nullable(),
  status: z.enum(organizationalUnitStatuses).nullable()
});

export type FindDepartmentRequest = z.infer<typeof findDepartmentRequest>;
