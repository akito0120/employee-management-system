import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findSubDepartmentRequest = z.object({
  name: z.string().nullish(),
  subDepartmentCode: z.string().nullish(),
  statuses: z.array(z.enum(organizationalUnitStatuses)).nullish(),
  departmentIds: z.array(z.number()).nullish(),
  page: z.number()
});

export const findSubDepartmentResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      status: z.enum(organizationalUnitStatuses),
      code: z.string(),
      department: z.object({
        id: z.number(),
        name: z.string(),
        code: z.string()
      })
    })
  )
});

export type FindSubDepartmentRequest = z.infer<typeof findSubDepartmentRequest>;
export type FindSubDepartmentResponse = z.infer<typeof findSubDepartmentResponse>;
