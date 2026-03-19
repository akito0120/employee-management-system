import { string, z } from 'zod';

export const changePasswordRequest = z.object({
  currentPassword: string(),
  newPassword: string().min(6).trim()
});

export type ChangePasswordRequest = z.infer<typeof changePasswordRequest>;
