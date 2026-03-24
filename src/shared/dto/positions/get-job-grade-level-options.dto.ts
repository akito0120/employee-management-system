import { z } from 'zod';

export const getJobGradeLevelOptionsRequest = z.object({
  positionId: z.number().nullable()
});

export type GetJobGradeLevelOptionsRequest = z.infer<typeof getJobGradeLevelOptionsRequest>;
