import { z } from 'zod';

import { employeeStatuses, jobGradeLevel } from '../../../main/db/schema';

export const registerEmployeeRequest = z.object({
  code: z.string().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  birthDate: z.date(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  status: z.enum(employeeStatuses),
  country: z.string().nullable(),
  state: z.string().nullable(),
  city: z.string().nullable(),
  line1: z.string().nullable(),
  line2: z.string().nullable(),
  postalCode: z.string().nullable(),
  organizationId: z.coerce.number().nullable(),
  isManager: z.boolean().nullish(),
  positionId: z.coerce.number(),
  jobGradeLevel: z.enum(jobGradeLevel),
  baseSalary: z.coerce.number(),
  remarks: z.string().nullish()
});

export type RegisterEmployeeRequest = z.infer<typeof registerEmployeeRequest>;
