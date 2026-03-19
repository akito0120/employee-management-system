import t from '../../trpc';

const unitRouter = t.router({
  registerUnit: t.procedure.mutation(() => {}),
  findUnit: t.procedure.query(() => {})
});

export default unitRouter;
