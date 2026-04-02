import { initTRPC } from '@trpc/server';
import { container } from 'tsyringe';

import { SessionInfo } from './modules/auth/session-info';

const t = initTRPC.create({
  isServer: true
});

export const adminProcedure = t.procedure.use(
  t.middleware(({ next, ctx }) => {
    const sessionInfo = container.resolve(SessionInfo);
    if (!sessionInfo.isAdmin) throw new Error('Unauthorized');
    return next({ ctx });
  })
);

export default t;
