import { and, eq, like, or } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from '../../../shared/dto/employees/find-employee.dto';
import { RegisterEmployeeRequest } from '../../../shared/dto/employees/register-employee.dto';
import { DatabaseType } from '../../db';
import { employees, jobGrades, NewEmployee } from '../../db/schema';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class EmployeeService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async registerEmployee(req: RegisterEmployeeRequest): Promise<void> {
    const jobGrade = await this.db.query.jobGrades.findFirst({
      where: and(eq(jobGrades.positionId, req.positionId), eq(jobGrades.level, req.jobGradeLevel)),
      columns: { id: true }
    });

    if (!jobGrade) throw new Error('No such job grade exists');

    if (req.organizationId) {
      const curretManager = await this.db.query.employees.findFirst({
        where: and(eq(employees.organizationId, req.organizationId), eq(employees.isManager, true))
      });
      if (curretManager) throw new Error('The already exists a manager for selected organization');
    }

    const newEmployee: NewEmployee = {
      code: req.code,
      firstName: req.firstName,
      lastName: req.lastName,
      birthDate: req.birthDate,
      email: req.email,
      phoneNumber: req.phoneNumber,
      status: req.status,
      country: req.country,
      state: req.state,
      city: req.city,
      line1: req.line1,
      line2: req.line2,
      postalCode: req.postalCode,
      organizationId: req.organizationId,
      isManager: req.isManager,
      jobGradeId: jobGrade.id,
      baseSalary: req.baseSalary,
      remarks: req.remarks,
      lastPromotionDate: new Date()
    };

    await this.db.insert(employees).values(newEmployee);
  }

  async findEmployee(req: FindEmployeeRequest): Promise<FindEmployeeResponse> {
    const where = and(
      ...(req.name
        ? [
            or(
              like(employees.firstName, `%${req.name}%`),
              like(employees.lastName, `%${req.name}%`)
            )
          ]
        : []),
      ...(req.code ? [like(employees.code, `%${req.code}%`)] : []),
      ...(req.organizationId ? [eq(employees.organizationId, req.organizationId)] : []),
      ...(req.status ? [eq(employees.status, req.status)] : [])
    );

    const employeeList = await this.db.query.employees.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10,
      with: { organization: { columns: { name: true } } }
    });

    const total = await this.db.$count(employees, where);

    return {
      total,
      items: employeeList.map((empl) => ({
        id: empl.id,
        firstName: empl.firstName,
        lastName: empl.lastName,
        code: empl.code,
        email: empl.email,
        status: empl.status,
        affiliation: empl.organization?.name
      }))
    };
  }
}
