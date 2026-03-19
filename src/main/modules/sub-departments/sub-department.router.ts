import t from '../../trpc';

const subDepartmentRouter = t.router({
  registerSubDepartment: t.procedure.mutation(() => {}),
  findSubDepartment: t.procedure.query(() => {})
});

export default subDepartmentRouter;
