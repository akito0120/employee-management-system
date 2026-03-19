import { container } from 'tsyringe';

import { loginRequest } from '../../../shared/dto/auth/login.dto';
import t from '../../trpc';
import { AuthService } from './auth.service';

const authRouter = t.router({
  login: t.procedure.input(loginRequest).mutation(async (c) => {
    const authService = container.resolve(AuthService);
    await authService.login({ email: c.input.email, password: c.input.password });
  }),
  logout: t.procedure.mutation(() => {
    const authService = container.resolve(AuthService);
    authService.logout();
  }),
  getMe: t.procedure.query(async () => {
    const authService = container.resolve(AuthService);
    return await authService.getMe();
  })
});

export default authRouter;
