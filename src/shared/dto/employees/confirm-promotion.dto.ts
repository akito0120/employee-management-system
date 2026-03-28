import { z } from 'zod';

export const confirmPromotionRequest = z.object({
  employeeId: z.number(),
  positionId: z.number()
});

export type ConfirmPromotionRequest = z.infer<typeof confirmPromotionRequest>;
