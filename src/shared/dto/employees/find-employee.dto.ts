import { z } from 'zod';

import { employeeStatuses } from '../../../main/db/schema';

export const findEmployeeRequest = z.object({
  page: z.coerce.number(),
  name: z.string().nullable(),
  code: z.string().nullable(),
  organizationId: z.coerce.number().nullable(),
  status: z.enum(employeeStatuses).nullable()
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
      status: z.enum(employeeStatuses)
    })
  )
});

export type FindEmployeeRequest = z.infer<typeof findEmployeeRequest>;
export type FindEmployeeResponse = z.infer<typeof findEmployeeResponse>;
