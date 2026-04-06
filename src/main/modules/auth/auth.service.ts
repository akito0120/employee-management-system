import { compare, genSalt, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { ChangePasswordRequest } from '../../../shared/dto/auth/change-password.dto';
import { EditProfileRequest } from '../../../shared/dto/auth/edit-profile.dto';
import { GetMeResponse } from '../../../shared/dto/auth/get-me.dto';
import { LoginRequest } from '../../../shared/dto/auth/login.dto';
import { DatabaseType } from '../../db';
import { users } from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { SessionInfo } from './session-info';

@injectable()
export class AuthService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
    this.logService = container.resolve(AuditLogService);
  }

  async login({ email, password }: LoginRequest): Promise<void> {
    const user = await this.db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) throw new Error('No such user');

    const passwordCorrect = await compare(password, user.password);
    if (!passwordCorrect) throw new Error('Incorrect password');

    this.sessionInfo.currentUserId = user.id;
    this.sessionInfo.isAdmin = user.isAdmin;

    this.logService.log({
      category: 'AUTH'
    });
  }

  logout(): void {
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

  async editProfile(req: EditProfileRequest) {
    const userId = this.sessionInfo.currentUserId;
    if (userId === null) throw new Error('Not logged in');

    await this.db
      .update(users)
      .set({
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email
      })
      .where(eq(users.id, userId));
  }
}
