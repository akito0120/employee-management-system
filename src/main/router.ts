import { z } from 'zod'
import t from './trpc'
import authRouter from './modules/auth/auth.router'

export const router = t.router

export const appRouter = router({
  greet: t.procedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
    console.log('Greet')
    return `Hello, ${input.name}! from Main Process`
  }),
  auth: authRouter
})

export type AppRouter = typeof appRouter
