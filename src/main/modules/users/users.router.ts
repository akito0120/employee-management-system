import { container } from 'tsyringe';
import { z } from 'zod';

import { createUserRequestDto } from '../../../shared/dto/users/create-user.dto';
import { findUserRequest } from '../../../shared/dto/users/find-user.dto';
import t, { adminProcedure } from '../../trpc';
import { UserService } from './user.service';

const userRouter = t.router({
  createUser: adminProcedure.input(createUserRequestDto).mutation(async (c) => {
    const service = container.resolve(UserService);
    await service.createUser(c.input);
  }),
  deleteUser: adminProcedure.input(z.number()).mutation(async (c) => {
    const service = container.resolve(UserService);
    await service.deleteUser(c.input);
  }),
  findUser: adminProcedure.input(findUserRequest).query(async (c) => {
    const service = container.resolve(UserService);
    return await service.findUser(c.input);
  })
});

export default userRouter;
