import { initTRPC } from '@trpc/server';

const t = initTRPC.create({
  isServer: true
});

export default t;
