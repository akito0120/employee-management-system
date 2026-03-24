import { z } from 'zod';

import authRouter from './modules/auth/auth.router';
import departmentRouter from './modules/departments/department.router';
import employeeRouter from './modules/employees/employee.router';
import positionRouter from './modules/positions/position.router';
import subDepartmentRouter from './modules/sub-departments/sub-department.router';
import unitRouter from './modules/units/unit.router';
import t from './trpc';

export const router = t.router;

export const appRouter = router({
  greet: t.procedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
    console.log('Greet');
    return `Hello, ${input.name}! from Main Process`;
  }),
  auth: authRouter,
  departments: departmentRouter,
  subDepartments: subDepartmentRouter,
  units: unitRouter,
  positions: positionRouter,
  employees: employeeRouter
});

export type AppRouter = typeof appRouter;
