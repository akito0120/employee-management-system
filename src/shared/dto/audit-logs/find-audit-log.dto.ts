import { z } from 'zod';

import { actionTargets } from '../../../main/db/schema';

export const findAuditLogRequest = z.object({
  page: z.int().positive(),
  targets: z.array(z.enum(actionTargets)).nullish(),
  targetId: z.number().nullish()
});

export type FindAuditLogRequest = z.infer<typeof findAuditLogRequest>;
