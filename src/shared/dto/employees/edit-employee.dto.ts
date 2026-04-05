import { z } from 'zod';

import { employeeStatuses } from '../../../main/db/schema';

export const editEmployeeRequest = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.date(),
  code: z.string(),
  status: z.enum(employeeStatuses),
  organizationId: z.number(),
  email: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  line1: z.string().nullish(),
  line2: z.string().nullish(),
  postalCode: z.string().nullish(),
  remarks: z.string().nullish()
});

export type EditEmployeeRequest = z.infer<typeof editEmployeeRequest>;
