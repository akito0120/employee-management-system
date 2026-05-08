import { eq } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { CreateUserRequestDto } from '../../../shared/dto/users/create-user.dto';
import { DatabaseType } from '../../db';
import { users } from '../../db/schema';

@injectable()
export class UserService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
  }

  async createUser(req: CreateUserRequestDto) {
    await this.db.insert(users).values(req);
  }

  async deleteUser(id: number) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
