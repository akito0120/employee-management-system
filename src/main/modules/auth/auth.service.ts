import { container, injectable } from 'tsyringe';
import { DatabaseType } from '../../db';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema';
import { compare } from 'bcryptjs';
import { LoginRequest } from '../../../shared/dto/auth/login.dto';
import { SessionInfo } from './session-info';
import { GetMeResponse } from '../../../shared/dto/auth/get-me.dto';

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
}
