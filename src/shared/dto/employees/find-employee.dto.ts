import { z } from 'zod';

import { employeeStatuses } from '../../../main/db/schema';

export const employeeEligibilities = ['ELIGIBLE_FOR_RAISE', 'ELIGIBLE_FOR_PROMOTION'] as const;

export const findEmployeeRequest = z.object({
  page: z.coerce.number(),
  name: z.string().nullish(),
  code: z.string().nullish(),
  organizationIds: z.array(z.number()).nullish(),
  statuses: z.array(z.enum(employeeStatuses)).nullish(),
  excludeIds: z.array(z.number()).nullish(),
  eligibilities: z.array(z.enum(employeeEligibilities)).nullish()
});

export const findEmployeeResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      code: z.string(),
      email: z.string().nullable(),
      status: z.enum(employeeStatuses),
      affiliation: z.string().nullish()
    })
  )
});

export type FindEmployeeRequest = z.infer<typeof findEmployeeRequest>;
export type FindEmployeeResponse = z.infer<typeof findEmployeeResponse>;
