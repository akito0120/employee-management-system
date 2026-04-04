import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const registerDepartmentRequest = z.object({
  id: z.number().nullish(),
  name: z.string().nonempty(),
  code: z.string(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullish()
});

export type RegisterDepartmentRequest = z.infer<typeof registerDepartmentRequest>;
