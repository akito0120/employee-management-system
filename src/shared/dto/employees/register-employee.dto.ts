import { z } from 'zod';

import { employeeStatuses } from '../../../main/db/schema';

export const registerEmployeeRequest = z.object({
  code: z.string().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  birthDate: z.date(),
  email: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  status: z.enum(employeeStatuses),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  line1: z.string().nullish(),
  line2: z.string().nullish(),
  postalCode: z.string().nullish(),
  organizationId: z.coerce.number(),
  positionId: z.coerce.number(),
  remarks: z.string().nullish(),
  lastPromotionDate: z.date().nullish(),
  lastRaiseDate: z.date().nullish()
});

export type RegisterEmployeeRequest = z.infer<typeof registerEmployeeRequest>;
