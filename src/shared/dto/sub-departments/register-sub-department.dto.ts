import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const registerSubDepartmentRequest = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullish(),
  departmentId: z.number(),
  id: z.number().nullish()
});

export type RegisterSubDepartmentRequest = z.infer<typeof registerSubDepartmentRequest>;
