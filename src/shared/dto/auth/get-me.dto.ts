import { boolean, string, z } from 'zod'

export const getMeResponse = z.object({
  firstName: string(),
  lastName: string(),
  email: string(),
  isAdmin: boolean()
})

export type GetMeResponse = z.infer<typeof getMeResponse>
