import { addMonths, isAfter } from 'date-fns';
import { and, eq, gte, inArray, like, notInArray, or } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from '../../../shared/dto/employees/find-employee.dto';
import { FindEmployeeByIdResponse } from '../../../shared/dto/employees/get-employee.dto';
import { RegisterEmployeeRequest } from '../../../shared/dto/employees/register-employee.dto';
import { DatabaseType } from '../../db';
import {
  commendations,
  employeeCommendations,
  employees,
  NewEmployee,
  positions
} from '../../db/schema';
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
    if (req.organizationId) {
      const curretManager = await this.db.query.employees.findFirst({
        where: and(eq(employees.organizationId, req.organizationId), eq(employees.isManager, true))
      });
      if (curretManager && req.isManager === true)
        throw new Error('The already exists a manager for selected organization');
    }

    const position = await this.db.query.positions.findFirst({
      where: eq(positions.id, req.positionId)
    });
    if (!position) throw new Error('No such position was found');

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
      isManager: req.isManager ?? false,
      baseSalary: position.initialSalary,
      remarks: req.remarks,
      lastPromotionDate: req.lastPromotionDate ?? new Date(),
      lastRaiseDate: req.lastRaiseDate ?? new Date(),
      positionId: req.positionId
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
      ...(req.status ? [eq(employees.status, req.status)] : []),
      ...(req.excludeIds && req.excludeIds.length > 0
        ? [notInArray(employees.id, req.excludeIds)]
        : [])
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

  async findEmployeeById(id: number): Promise<FindEmployeeByIdResponse> {
    const empl = await this.db.query.employees.findFirst({
      where: eq(employees.id, id),
      with: {
        organization: true,
        position: true
      }
    });

    if (!empl) throw new Error('No employee was found');

    const { eligibleForRaise, nextRaiseSchedule } = await this.getRaiseEligibility(
      id,
      empl.lastRaiseDate
    );

    const { eligibleForPromotion, nextPromotionSchedule } = await this.getPromotionEligibility(
      empl.lastPromotionDate,
      empl.position.timeInRole
    );

    return {
      id: empl.id,
      firstName: empl.firstName,
      lastName: empl.lastName,
      code: empl.code,
      birthDate: empl.birthDate,
      email: empl.email,
      phoneNumber: empl.phoneNumber,
      status: empl.status,
      country: empl.country,
      state: empl.state,
      city: empl.city,
      line1: empl.line1,
      line2: empl.line2,
      postalCode: empl.postalCode,
      remarks: empl.remarks,
      baseSalary: empl.baseSalary,
      lastPromotionDate: empl.lastPromotionDate,
      isManager: empl.isManager,
      affiliation: {
        organizationId: empl.organization.id,
        name: empl.organization.name,
        code: empl.organization.code
      },
      position: { name: empl.position.name, grade: empl.position.grade },
      lastRaiseDate: empl.lastRaiseDate,
      promotionEligibility: {
        eligible: eligibleForPromotion,
        nextGrade: Math.min(empl.position.grade + 1, 12),
        scheduledAt: nextPromotionSchedule
      },
      raiseEligibility: {
        eligible: eligibleForRaise,
        nextSalary: empl.baseSalary + empl.position.raiseAmount,
        scheduledAt: nextRaiseSchedule
      }
    };
  }

  private async getRaiseEligibility(employeeId: number, lastRaiseDate: Date) {
    const totalAdjustment = await this.getTotalAdjustment(employeeId, lastRaiseDate);

    const today = new Date();
    const nextRaiseSchedule = addMonths(lastRaiseDate, 12 - totalAdjustment);
    const eligibleForRaise = isAfter(today, nextRaiseSchedule);

    return {
      eligibleForRaise,
      nextRaiseSchedule
    };
  }

  private async getPromotionEligibility(lastPromotionDate: Date, timeInRole: number | null) {
    const today = new Date();
    const nextPromotionSchedule = addMonths(lastPromotionDate, timeInRole ?? 0);
    const eligibleForPromotion = isAfter(today, nextPromotionSchedule);

    return { eligibleForPromotion, nextPromotionSchedule };
  }

  private async getTotalAdjustment(employeeId: number, from: Date) {
    const commendationIds = (
      await this.db.query.employeeCommendations.findMany({
        where: eq(employeeCommendations.employeeId, employeeId)
      })
    ).map((ec) => ec.commendationId);

    const comms = await this.db.query.commendations.findMany({
      where: and(inArray(commendations.id, commendationIds), gte(commendations.issuedAt, from))
    });

    return comms.reduce((adj, comm) => {
      if (comm.category === 'COMMENDATION') return adj + comm.adjustment;
      return adj - comm.adjustment;
    }, 0);
  }

  async confirmRaise(id: number) {
    const empl = await this.db.query.employees.findFirst({
      where: eq(employees.id, id),
      columns: { lastRaiseDate: true, baseSalary: true },
      with: { position: { columns: { raiseAmount: true } } }
    });

    if (!empl) throw new Error('No employee was found');

    const { eligibleForRaise } = await this.getRaiseEligibility(id, empl.lastRaiseDate);
    if (!eligibleForRaise) throw new Error('Selected employee is not eligible for raise');

    const today = new Date();
    await this.db
      .update(employees)
      .set({
        lastRaiseDate: today,
        baseSalary: empl.baseSalary + empl.position.raiseAmount
      })
      .where(eq(employees.id, id));
  }
}
