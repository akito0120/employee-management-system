import { z } from 'zod';

export const findUserRequest = z.object({
  name: z.string().nullish(),
  isAdmin: z.boolean().nullish(),
  page: z.int().positive()
});

export type FindUserRequest = z.infer<typeof findUserRequest>;
