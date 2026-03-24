import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findDepartmentRequest = z.object({
  name: z.string().nullable(),
  departmentCode: z.string().nullable(),
  status: z.enum(organizationalUnitStatuses).nullable(),
  page: z.number()
});

export const findDepartmentResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
      code: z.string(),
      status: z.enum(organizationalUnitStatuses)
    })
  )
});

export type FindDepartmentRequest = z.infer<typeof findDepartmentRequest>;
export type FindDepartmentResponse = z.infer<typeof findDepartmentResponse>;
