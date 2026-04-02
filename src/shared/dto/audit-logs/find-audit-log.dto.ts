import { z } from 'zod';

export const findAuditLogRequest = z.object({
  page: z.int().positive()
});

export type FindAuditLogRequest = z.infer<typeof findAuditLogRequest>;
