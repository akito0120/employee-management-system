import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const registerSubDepartmentRequest = z.object({
  name: z.string().nonempty(),
  code: z.string(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullable(),
  departmentId: z.number()
});

export type RegisterSubDepartmentRequest = z.infer<typeof registerSubDepartmentRequest>;
