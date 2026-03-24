import { z } from 'zod';

import { organizationalUnitStatuses } from '../../../main/db/schema';

export const findUnitRequest = z.object({
  page: z.coerce.number(),
  name: z.string().nullable(),
  status: z.enum(organizationalUnitStatuses).nullable()
});

export const findUnitResponse = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      status: z.enum(organizationalUnitStatuses),
      code: z.string(),
      subDepartment: z.object({
        id: z.number(),
        name: z.string(),
        code: z.string()
      })
    })
  )
});

export type FindUnitRequest = z.infer<typeof findUnitRequest>;
export type FindUnitResponse = z.infer<typeof findUnitResponse>;
