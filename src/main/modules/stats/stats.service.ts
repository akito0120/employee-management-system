import { avg } from 'drizzle-orm';
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

  async getAverageSalary() {
    const result = await this.db.select({ avgSalary: avg(employees.baseSalary) }).from(employees);
    return Number(result[0].avgSalary);
  }
}
