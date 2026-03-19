import { z } from 'zod';

import authRouter from './modules/auth/auth.router';
import departmentRouter from './modules/departments/department.router';
import t from './trpc';

export const router = t.router;

export const appRouter = router({
  greet: t.procedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
    console.log('Greet');
    return `Hello, ${input.name}! from Main Process`;
  }),
  auth: authRouter,
  departments: departmentRouter
});

export type AppRouter = typeof appRouter;
