import { z } from 'zod';

export const createUserRequestDto = z.object({
  email: z.email(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  password: z.string().nonempty(),
  isAdmin: z.boolean()
});

export type CreateUserRequestDto = z.infer<typeof createUserRequestDto>;
