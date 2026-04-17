import { container, injectable } from 'tsyringe';

import { DatabaseType } from '../../db';
import { employees } from '../../db/schema';

@injectable()
export class StatsService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
  }

  async getEmployeeCount() {
    return this.db.$count(employees);
  }
}
