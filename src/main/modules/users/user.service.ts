import { genSalt, hash } from 'bcryptjs';
import { and, asc, eq, like, or } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { CreateUserRequestDto } from '../../../shared/dto/users/create-user.dto';
import { FindUserRequest } from '../../../shared/dto/users/find-user.dto';
import { DatabaseType } from '../../db';
import { users } from '../../db/schema';

@injectable()
export class UserService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
  }

  async createUser(req: CreateUserRequestDto) {
    const salt = await genSalt();
    const hashedPassword = await hash(req.password, salt);

    await this.db.insert(users).values({ ...req, password: hashedPassword });
  }

  async canDeleteUser(id: number) {
    const user = await this.db.query.users.findFirst({ where: eq(users.id, id) });
    if (!user) throw new Error('No user was found');

    const adminCount = await this.db.$count(users, eq(users.isAdmin, true));
    const nonAdminCount = await this.db.$count(users, eq(users.isAdmin, false));

    if (user.isAdmin && adminCount === 1) return false;
    if (!user.isAdmin && nonAdminCount === 1) return false;

    return true;
  }

  async deleteUser(id: number) {
    const canDelete = await this.canDeleteUser(id);
    if (!canDelete) throw new Error('Selected user cannot be deleted');

    await this.db.delete(users).where(eq(users.id, id));
  }

  async findUser(req: FindUserRequest) {
    const where = and(
      ...(req.isAdmin ? [eq(users.isAdmin, true)] : []),
      ...(req.name
        ? [or(like(users.firstName, `%${req.name}%`), like(users.lastName, `%${req.name}%`))]
        : [])
    );

    const items = await this.db.query.users.findMany({
      where,
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true
      },
      orderBy: asc(users.id),
      offset: (req.page - 1) * 10,
      limit: 10
    });

    const total = await this.db.$count(users, where);
    return { items, total };
  }
}
