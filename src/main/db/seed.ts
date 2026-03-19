import { eq } from 'drizzle-orm';
import { db } from '.';
import { NewUser, users } from './schema';
import { hash, genSalt } from 'bcryptjs';

const seedDB = async (): Promise<void> => {
  const password = 'password';

  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);

  const firstAdmin = await db.query.users.findFirst({ where: eq(users.isAdmin, true) });
  if (!firstAdmin) {
    const admin: NewUser = {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'Admin',
      password: hashedPassword,
      isAdmin: true
    };

    const result = await db.insert(users).values(admin).returning();
    console.log('Default admin has been created');
    console.log(JSON.stringify(result[0], null, 2));
  }

  const firstUser = await db.query.users.findFirst({ where: eq(users.isAdmin, false) });
  if (!firstUser) {
    const user: NewUser = {
      email: 'user1@example.com',
      firstName: 'User1',
      lastName: 'User1',
      password: hashedPassword,
      isAdmin: false
    };

    const result = await db.insert(users).values(user).returning();
    console.log('Default user has been created');
    console.log(JSON.stringify(result[0], null, 2));
  }
};

export default seedDB;
