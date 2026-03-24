import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const registerUnitRequest = z.object({
  name: z.string().nonempty(),
  code: z.string(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullable(),
  subDepartmentId: z.coerce.number()
});

export type RegisterUnitRequest = z.infer<typeof registerUnitRequest>;
