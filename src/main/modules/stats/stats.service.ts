import { subWeeks } from 'date-fns';
import { avg, count, eq, gte, sql } from 'drizzle-orm';
import _ from 'lodash';
import { container, injectable } from 'tsyringe';

import { DatabaseType } from '../../db';
import {
  ActionTarget,
  auditLogs,
  employees,
  organizationalUnits,
  positions
} from '../../db/schema';

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

  async getEmployeeCountByJobGrade() {
    return this.db
      .select({
        grade: positions.grade,
        employeeCount: count(employees.id)
      })
      .from(employees)
      .leftJoin(positions, eq(employees.positionId, positions.id))
      .groupBy(positions.grade);
  }

  async getActivitieStats() {
    const today = new Date();
    const tenDaysAgo = subWeeks(today, 1);

    const result = await this.db
      .select({
        date: sql<string>`date(${auditLogs.performedAt}, 'unixepoch')`.as('log_date'),
        target: auditLogs.target,
        count: count()
      })
      .from(auditLogs)
      .where(gte(auditLogs.performedAt, tenDaysAgo))
      .groupBy(sql`log_date`, auditLogs.target)
      .orderBy(sql`log_date ASC`);

    return _(result)
      .groupBy('date')
      .map((items, date) => {
        const row: { date: string; value: Record<ActionTarget, number> } = {
          date,
          value: {
            COMMENDATION: 0,
            DEPARTMENT: 0,
            EMPLOYEE: 0,
            PERFORMANCE_EVALUATION: 0,
            POSITION: 0,
            SUB_DEPARTMENT: 0,
            UNIT: 0
          }
        };

        items.forEach((item) => {
          if (item.target) row.value[item.target] = item.count;
        });

        return row;
      })
      .value();
  }

  async getAverageSalaryByDept() {
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
        averageSalary: avg(employees.baseSalary)
      })
      .from(hierarchySq)
      .leftJoin(employees, eq(employees.organizationId, hierarchySq.id))
      .innerJoin(organizationalUnits, eq(organizationalUnits.id, hierarchySq.root_department_id))
      .groupBy(hierarchySq.root_department_id.sql, organizationalUnits.name);
  }
}
