import t from '../../trpc';

const positionRouter = t.router({
  registerPosition: t.procedure.query(() => {})
});

export default positionRouter;
