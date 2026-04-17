import { avg, count, eq, sql } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { DatabaseType } from '../../db';
import { employees, organizationalUnits } from '../../db/schema';

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

  async getEmployeeCountByDept() {
    const hierarchySq = this.db.$with('unit_hierarchy').as(
      this.db
        .select({
          id: organizationalUnits.id,
          root_department_id: sql`organizational_units.id`.as('root_department_id'),
          type: organizationalUnits.type
        })
        .from(organizationalUnits)
        .where(eq(organizationalUnits.type, 'DEPARTMENT'))
        .unionAll(
          this.db
            .select({
              id: organizationalUnits.id,
              root_department_id: sql<number>`unit_hierarchy.root_department_id`,
              type: organizationalUnits.type
            })
            .from(organizationalUnits)
            .innerJoin(
              sql`unit_hierarchy`,
              eq(organizationalUnits.parentId, sql`unit_hierarchy.id`)
            )
        )
    );

    return await this.db
      .with(hierarchySq)
      .select({
        departmentId: hierarchySq.root_department_id,
        departmentName: organizationalUnits.name,
        employeeCount: count(employees.id)
      })
      .from(hierarchySq)
      .leftJoin(employees, eq(employees.organizationId, hierarchySq.id))
      .innerJoin(organizationalUnits, eq(organizationalUnits.id, hierarchySq.root_department_id))
      .groupBy(hierarchySq.root_department_id.sql, organizationalUnits.name);
  }

  async getEmployeeCountByStatus() {
    return this.db
      .select({
        status: employees.status,
        employeeCount: count(employees.id)
      })
      .from(employees)
      .groupBy(employees.status);
  }

  async getDeptCount() {
    return this.db.$count(organizationalUnits, eq(organizationalUnits.type, 'DEPARTMENT'));
  }

  async getSubDeptCount() {
    return this.db.$count(organizationalUnits, eq(organizationalUnits.type, 'SUB_DEPARTMENT'));
  }

  async getUnitCount() {
    return this.db.$count(organizationalUnits, eq(organizationalUnits.type, 'UNIT'));
  }
}
