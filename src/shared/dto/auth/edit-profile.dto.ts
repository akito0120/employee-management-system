import { z } from 'zod';

export const editProfileRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string()
});

export type EditProfileRequest = z.infer<typeof editProfileRequest>;
