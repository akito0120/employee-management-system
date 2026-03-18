import z, { string } from 'zod'

export const loginRequestBody = z.object({
  email: string(),
  password: string()
})

export type LoginRequestBody = z.infer<typeof loginRequestBody>
