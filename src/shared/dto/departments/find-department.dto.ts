import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findDepartmentRequest = z.object({
  name: z.string().nullish(),
  departmentCode: z.string().nullish(),
  statuses: z.array(z.enum(organizationalUnitStatuses)).nullish(),
  page: z.coerce.number()
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
