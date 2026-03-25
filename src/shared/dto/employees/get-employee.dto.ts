import { z } from 'zod';

import { employeeStatuses, jobGradeLevel } from '../../../main/db/schema';

export const findEmployeeByIdResponse = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  code: z.string(),
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
  remarks: z.string().nullish(),
  baseSalary: z.number(),
  lastPromotionDate: z.date(),
  isManager: z.boolean(),
  affiliation: z
    .object({
      organizationId: z.number(),
      name: z.string(),
      code: z.string()
    })
    .nullish(),
  position: z
    .object({
      id: z.number(),
      name: z.string(),
      jobGradeLevel: z.enum(jobGradeLevel)
    })
    .nullish()
});

export type FindEmployeeByIdResponse = z.infer<typeof findEmployeeByIdResponse>;
