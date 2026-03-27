import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const registerUnitRequest = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  status: z.enum(organizationalUnitStatuses),
  description: z.string().nullish(),
  subDepartmentId: z.coerce.number()
});

export type RegisterUnitRequest = z.infer<typeof registerUnitRequest>;
