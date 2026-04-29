import { z } from 'zod';

import { employeeStatuses } from '../../../main/db/schema';

export const importEmployeeRequest = z.array(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    code: z.string(),
    birthDate: z.date(),
    status: z.enum(employeeStatuses),
    position: z.string(),
    affiliation: z.string(),
    lastRaiseDate: z.date().nullish(),
    raiseCount: z.number(),
    email: z.string().nullish(),
    phoneNumber: z.string().nullish(),
    country: z.string().nullish(),
    state: z.string().nullish(),
    city: z.string().nullish(),
    line1: z.string().nullish(),
    line2: z.string().nullish(),
    postalCode: z.string().nullish(),
    remarks: z.string().nullish()
  })
);

export type ImportEmployeeRequest = z.infer<typeof importEmployeeRequest>;
