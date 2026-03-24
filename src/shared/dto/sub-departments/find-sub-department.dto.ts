import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findSubDepartmentRequest = z.object({
  name: z.string().nullable(),
  subDepartmentCode: z.string().nullable(),
  status: z.enum(organizationalUnitStatuses).nullable(),
  page: z.coerce.number(),
  departmentId: z.coerce.number().nullable()
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
