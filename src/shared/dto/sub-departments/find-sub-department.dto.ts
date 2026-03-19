import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findSubDepartmentRequest = z.object({
  name: z.string().nullable(),
  subDepartmentCode: z.string().nullable(),
  status: z.enum(organizationalUnitStatuses).nullable()
});

export type FindSubDepartmentRequest = z.infer<typeof findSubDepartmentRequest>;
