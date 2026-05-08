import { z } from 'zod';

import auditLogRouter from './modules/audit-logs/audit-log.router';
import authRouter from './modules/auth/auth.router';
import commendationRouter from './modules/commendations/commendation.router';
import departmentRouter from './modules/departments/department.router';
import employeeRouter from './modules/employees/employee.router';
import performanceEvaluationRouter from './modules/performance-evaluations/performance-evaluation.router';
import positionRouter from './modules/positions/position.router';
import statsRouter from './modules/stats/stats.router';
import subDepartmentRouter from './modules/sub-departments/sub-department.router';
import unitRouter from './modules/units/unit.router';
import userRouter from './modules/users/users.router';
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
  employees: employeeRouter,
  commendations: commendationRouter,
  performanceEvaluations: performanceEvaluationRouter,
  auditLogs: auditLogRouter,
  stats: statsRouter,
  users: userRouter
});

export type AppRouter = typeof appRouter;
