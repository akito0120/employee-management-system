import { compare, genSalt, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { ChangePasswordRequest } from '../../../shared/dto/auth/change-password.dto';
import { GetMeResponse } from '../../../shared/dto/auth/get-me.dto';
import { LoginRequest } from '../../../shared/dto/auth/login.dto';
import { DatabaseType } from '../../db';
import { users } from '../../db/schema';
import { SessionInfo } from './session-info';

@injectable()
export class AuthService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async login({ email, password }: LoginRequest): Promise<void> {
    console.log('Login');

    const user = await this.db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) throw new Error('No such user');

    const passwordCorrect = await compare(password, user.password);
    if (!passwordCorrect) throw new Error('Incorrect password');

    this.sessionInfo.currentUserId = user.id;
  }

  logout(): void {
    console.log('Logout');

    this.sessionInfo.clear();
  }

  async getMe(): Promise<GetMeResponse | null> {
    if (!this.sessionInfo.currentUserId) return null;

    const user = await this.db.query.users.findFirst({
      where: eq(users.id, this.sessionInfo.currentUserId)
    });

    if (!user) return null;

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin
    };
  }

  async changePassword({ currentPassword, newPassword }: ChangePasswordRequest): Promise<void> {
    console.log('Change Password');
    const currentUserId = this.sessionInfo.currentUserId;
    if (!currentUserId) throw new Error('Not logged in');

    const user = await this.db.query.users.findFirst({ where: eq(users.id, currentUserId) });
    if (!user) throw new Error('No such user');

    const passwordCorrect = compare(currentPassword, user.password);
    if (!passwordCorrect) throw new Error('Incorrect password');

    const salt = await genSalt();
    const hashedPassword = await hash(newPassword, salt);

    const result = await this.db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, currentUserId));

    if (result.changes === 0) throw new Error('Something went wrong');
  }
}
