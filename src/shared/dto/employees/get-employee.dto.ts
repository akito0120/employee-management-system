import { z } from 'zod';

import { employeeStatuses } from '../../../main/db/schema';

export const findEmployeeByIdResponse = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  code: z.string(),
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
  remarks: z.string().nullable(),
  baseSalary: z.number(),
  lastPromotionDate: z.date(),
  lastRaiseDate: z.date(),
  affiliation: z
    .object({
      organizationId: z.number(),
      name: z.string(),
      code: z.string()
    })
    .nullable(),
  position: z.object({
    name: z.string(),
    grade: z.number()
  }),
  promotionEligibility: z.object({
    eligible: z.boolean(),
    nextGrade: z.number(),
    scheduledAt: z.date()
  }),
  raiseEligibility: z.object({
    eligible: z.boolean(),
    nextSalary: z.number(),
    scheduledAt: z.date()
  })
});

export type FindEmployeeByIdResponse = z.infer<typeof findEmployeeByIdResponse>;
