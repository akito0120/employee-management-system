import z, { string } from 'zod';

export const loginRequest = z.object({
  email: string(),
  password: string()
});

export type LoginRequest = z.infer<typeof loginRequest>;
