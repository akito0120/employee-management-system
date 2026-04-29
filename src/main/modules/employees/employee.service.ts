import { addMonths, format, isBefore } from 'date-fns';
import { and, eq, gt, inArray, like, lt, notInArray, or, sql } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { ConfirmPromotionRequest } from '../../../shared/dto/employees/confirm-promotion.dto';
import { EditEmployeeRequest } from '../../../shared/dto/employees/edit-employee.dto';
import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from '../../../shared/dto/employees/find-employee.dto';
import { FindEmployeeByIdResponse } from '../../../shared/dto/employees/get-employee.dto';
import { ImportEmployeeRequest } from '../../../shared/dto/employees/import-employee.dto';
import { RegisterEmployeeRequest } from '../../../shared/dto/employees/register-employee.dto';
import { DatabaseType } from '../../db';
import {
  commendations,
  employeeCommendations,
  employees,
  NewEmployee,
  organizationalUnits,
  positions
} from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class EmployeeService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  async registerEmployee(req: RegisterEmployeeRequest): Promise<void> {
    this.db.transaction((tx) => {
      const position = tx.query.positions
        .findFirst({
          where: eq(positions.id, req.positionId)
        })
        .sync();
      if (!position) throw new Error('No such position was found');

      if (req.raiseCount && req.raiseCount > position.raiseCount)
        throw new Error(
          "Employee's  raise count cannot be greater than selected position's raise count"
        );

      const baseSalary = req.raiseCount
        ? position.initialSalary + position.raiseAmount * req.raiseCount
        : position.initialSalary;

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
        baseSalary: baseSalary,
        remarks: req.remarks,
        raiseCount: req.raiseCount ?? 0,
        lastRaiseDate: req.lastRaiseDate ?? new Date(),
        positionId: req.positionId
      };

      const result = tx.insert(employees).values(newEmployee).run();

      const newValue = tx.query.employees
        .findFirst({
          where: eq(employees.id, result.lastInsertRowid as number)
        })
        .sync();

      this.logService.log({
        tx,
        category: 'CREATE',
        target: 'EMPLOYEE',
        targetId: result.lastInsertRowid as number,
        newValue: JSON.stringify(newValue, null, 2)
      });
    });
  }

  async findEmployee(req: FindEmployeeRequest): Promise<FindEmployeeResponse> {
    const sq = this.db
      .select({
        id: employees.id,
        lastRaiseDate: employees.lastRaiseDate,
        raiseCount: employees.raiseCount,
        totalAdjustment: sql<number>`coalesce(sum(
            case
              when ${commendations.category} = 'COMMENDATION' then ${commendations.adjustment}
              when ${commendations.category} = 'SANCTION' then -${commendations.adjustment}
              else 0
            end
          ), 0)`.as('total_adjustment'),
        positionRaiseCount: sql<number>`${positions.raiseCount}`.as('position_raise_count'),
        firstName: employees.firstName,
        lastName: employees.lastName,
        code: employees.code,
        email: employees.email,
        status: employees.status,
        organizationId: employees.organizationId,
        affiliation: organizationalUnits.name
      })
      .from(employees)
      .leftJoin(employeeCommendations, eq(employees.id, employeeCommendations.employeeId))
      .leftJoin(
        commendations,
        and(
          eq(employeeCommendations.commendationId, commendations.id),
          gt(commendations.issuedAt, employees.lastRaiseDate)
        )
      )
      .leftJoin(positions, eq(positions.id, employees.positionId))
      .leftJoin(organizationalUnits, eq(employees.organizationId, organizationalUnits.id))
      .groupBy(employees.id)
      .as('sq');

    const basicWhere = and(
      ...(req.name
        ? [or(like(sq.firstName, `%${req.name}%`), like(sq.lastName, `%${req.name}%`))]
        : []),
      ...(req.code ? [like(sq.code, `%${req.code}%`)] : []),
      ...(req.organizationIds && req.organizationIds.length > 0
        ? [inArray(sq.organizationId, req.organizationIds)]
        : []),
      ...(req.statuses && req.statuses.length > 0 ? [inArray(sq.status, req.statuses)] : []),
      ...(req.excludeIds && req.excludeIds.length > 0 ? [notInArray(sq.id, req.excludeIds)] : [])
    );

    const oneYearSinceLastRaise = lt(
      sql`datetime(${sq.lastRaiseDate}, 'unixepoch', (${12} - ${sq.totalAdjustment}) || ' months')`,
      sql<string>`datetime('now')`
    );

    const whereEligibleForRaise = and(
      oneYearSinceLastRaise,
      lt(sq.raiseCount, sq.positionRaiseCount)
    );

    const whereEligibleForPromotion = and(
      oneYearSinceLastRaise,
      eq(sq.raiseCount, sq.positionRaiseCount)
    );

    const eligibilityWhere = or(
      ...(req.eligibilities?.includes('ELIGIBLE_FOR_RAISE') ? [whereEligibleForRaise] : []),
      ...(req.eligibilities?.includes('ELIGIBLE_FOR_PROMOTION') ? [whereEligibleForPromotion] : [])
    );

    const where = and(basicWhere, eligibilityWhere);

    const employeeList = await this.db
      .select()
      .from(sq)
      .where(where)
      .offset((req.page - 1) * 10)
      .limit(10);

    const total = await this.db.$count(sq, where);

    return {
      total,
      items: employeeList.map((empl) => ({
        id: empl.id,
        firstName: empl.firstName,
        lastName: empl.lastName,
        code: empl.code,
        email: empl.email,
        status: empl.status,
        affiliation: empl.affiliation
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
      empl.lastRaiseDate,
      empl.raiseCount,
      empl.position.raiseCount
    );

    const { eligibleForPromotion, nextPromotionSchedule } = await this.getPromotionEligibility(
      id,
      empl.lastRaiseDate,
      empl.raiseCount,
      empl.position.raiseCount
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
      lastRaiseDate: empl.lastRaiseDate,
      raiseCount: empl.raiseCount,
      affiliation: {
        organizationId: empl.organization.id,
        name: empl.organization.name,
        code: empl.organization.code
      },
      position: {
        name: empl.position.name,
        grade: empl.position.grade,
        raiseCount: empl.position.raiseCount
      },
      promotionEligibility: {
        eligible: eligibleForPromotion,
        nextGrade: Math.max(empl.position.grade - 1, 1),
        scheduledAt: nextPromotionSchedule
      },
      raiseEligibility: {
        eligible: eligibleForRaise,
        nextSalary: empl.baseSalary + empl.position.raiseAmount,
        scheduledAt: nextRaiseSchedule
      }
    };
  }

  private async getRaiseEligibility(
    employeeId: number,
    lastRaiseDate: Date,
    raiseCount: number,
    positionRaiseCount: number
  ) {
    if (raiseCount >= positionRaiseCount)
      return { eligibleForRaise: false, nextRaiseSchedule: new Date() };

    const totalAdjustment = await this.getTotalAdjustment(employeeId, lastRaiseDate);

    const today = new Date();
    const nextRaiseSchedule = addMonths(lastRaiseDate, 12 - totalAdjustment);
    const eligibleForRaise = !isBefore(today, nextRaiseSchedule);

    return {
      eligibleForRaise,
      nextRaiseSchedule
    };
  }

  private async getPromotionEligibility(
    employeeId: number,
    lastRaiseDate: Date,
    raiseCount: number,
    positionRaiseCount: number
  ) {
    const requiredRaise = positionRaiseCount - raiseCount;

    const totalAdjustment = await this.getTotalAdjustment(employeeId, lastRaiseDate);

    const today = new Date();
    const nextPromotionSchedule = addMonths(
      lastRaiseDate,
      12 * (requiredRaise + 1) - totalAdjustment
    );
    const eligibleForPromotion = requiredRaise === 0 && !isBefore(today, nextPromotionSchedule);

    return { eligibleForPromotion, nextPromotionSchedule };
  }

  private async getTotalAdjustment(employeeId: number, from: Date) {
    const commendationIds = (
      await this.db.query.employeeCommendations.findMany({
        where: eq(employeeCommendations.employeeId, employeeId)
      })
    ).map((ec) => ec.commendationId);

    const comms = await this.db.query.commendations.findMany({
      where: and(inArray(commendations.id, commendationIds), gt(commendations.issuedAt, from))
    });

    return comms.reduce((adj, comm) => {
      if (comm.category === 'COMMENDATION') return adj + comm.adjustment;
      return adj - comm.adjustment;
    }, 0);
  }

  async confirmRaise(id: number) {
    const where = eq(employees.id, id);
    const oldValue = await this.db.query.employees.findFirst({ where });

    const empl = await this.db.query.employees.findFirst({
      where: eq(employees.id, id),
      columns: { lastRaiseDate: true, baseSalary: true, raiseCount: true },
      with: { position: { columns: { raiseAmount: true, raiseCount: true } } }
    });

    if (!empl) throw new Error('No employee was found');

    const { eligibleForRaise } = await this.getRaiseEligibility(
      id,
      empl.lastRaiseDate,
      empl.raiseCount,
      empl.position.raiseCount
    );
    if (!eligibleForRaise) throw new Error('Selected employee is not eligible for raise');

    const today = new Date();
    await this.db
      .update(employees)
      .set({
        lastRaiseDate: today,
        baseSalary: empl.baseSalary + empl.position.raiseAmount,
        raiseCount: sql`${employees.raiseCount} + 1`
      })
      .where(eq(employees.id, id));

    const newValue = await this.db.query.employees.findFirst({ where });

    this.logService.log({
      category: 'EDIT',
      target: 'EMPLOYEE',
      targetId: id,
      oldValue: JSON.stringify(oldValue, null, 2),
      newValue: JSON.stringify(newValue, null, 2)
    });
  }

  async confirmPromotion(req: ConfirmPromotionRequest) {
    const where = eq(employees.id, req.employeeId);
    const oldValue = await this.db.query.employees.findFirst({ where });

    const empl = await this.db.query.employees.findFirst({
      where: eq(employees.id, req.employeeId),
      columns: { lastPromotionDate: true, lastRaiseDate: true, id: true, raiseCount: true },
      with: { position: { columns: { raiseCount: true, grade: true } } }
    });

    if (!empl) throw new Error('No employee was found');

    const { eligibleForPromotion } = await this.getPromotionEligibility(
      empl.id,
      empl.lastRaiseDate,
      empl.raiseCount,
      empl.position.raiseCount
    );
    if (!eligibleForPromotion) throw new Error('Selected employee is not eligible for promotion');

    const position = await this.db.query.positions.findFirst({
      where: eq(positions.id, req.positionId),
      columns: { initialSalary: true, grade: true }
    });
    if (!position) throw new Error('No position was found');

    if (position.grade !== empl.position.grade - 1)
      throw new Error('Next position level is invalid');

    const today = new Date();
    await this.db
      .update(employees)
      .set({
        positionId: req.positionId,
        baseSalary: position?.initialSalary,
        lastRaiseDate: today,
        raiseCount: 0
      })
      .where(eq(employees.id, req.employeeId));

    const newValue = await this.db.query.employees.findFirst({ where });

    this.logService.log({
      category: 'EDIT',
      target: 'EMPLOYEE',
      targetId: req.employeeId,
      oldValue: JSON.stringify(oldValue, null, 2),
      newValue: JSON.stringify(newValue, null, 2)
    });
  }

  async export() {
    const employees = await this.db.query.employees.findMany({
      with: { position: { columns: { code: true } }, organization: { columns: { code: true } } }
    });

    const dateFormat = 'yyyy-MM-dd';

    return employees.map((empl) => ({
      firstName: empl.firstName,
      lastName: empl.lastName,
      code: empl.code,
      birthDate: format(empl.birthDate.toLocaleDateString(), dateFormat),
      status: empl.status,
      position: empl.position.code,
      baseSalary: empl.baseSalary,
      affiliation: empl.organization.code,
      lastRaiseDate: format(empl.lastRaiseDate.toLocaleDateString(), dateFormat),
      raiseCount: empl.raiseCount,
      email: empl.email,
      phoneNumber: empl.phoneNumber,
      country: empl.country,
      state: empl.state,
      city: empl.city,
      line1: empl.line1,
      line2: empl.line2,
      postalCode: empl.postalCode,
      remarks: empl.remarks
    }));
  }

  async getPositionCodeMap() {
    const items = await this.db.query.positions.findMany({
      columns: { id: true, code: true, initialSalary: true, raiseCount: true, raiseAmount: true }
    });
    return new Map(items.map(({ code, ...values }) => [code, values]));
  }

  async getAffiliationCodeMap() {
    const items = await this.db.query.organizationalUnits.findMany({
      columns: { id: true, code: true }
    });
    return new Map(items.map(({ code, ...values }) => [code, values]));
  }

  async import(req: ImportEmployeeRequest) {
    const positionCodeMap = await this.getPositionCodeMap();
    const affiliationCodeMap = await this.getAffiliationCodeMap();

    const newEmployees: NewEmployee[] = req.map(
      ({ position, affiliation, lastRaiseDate, raiseCount, ...values }) => {
        const positionData = positionCodeMap.get(position);
        const affiliationData = affiliationCodeMap.get(affiliation);

        if (!positionData) throw new Error(`No position found for employee ${values.code}`);
        if (!affiliationData) throw new Error(`No affiliation found for employee ${values.code}`);

        const today = new Date();

        if (raiseCount && raiseCount > positionData.raiseCount)
          throw new Error(
            "Employee's  raise count cannot be greater than selected position's raise count"
          );
        const baseSalary = raiseCount
          ? positionData.initialSalary + positionData.raiseAmount * raiseCount
          : positionData.initialSalary;

        return {
          ...values,
          positionId: positionData.id,
          baseSalary: baseSalary,
          organizationId: affiliationData.id,
          lastRaiseDate: lastRaiseDate ?? today,
          raiseCount: raiseCount ?? 0
        };
      }
    );

    const results = await this.db.insert(employees).values(newEmployees).returning();

    this.logService.logMany({
      items: results.map((result) => ({
        category: 'CREATE',
        target: 'EMPLOYEE',
        targetId: result.id,
        newValue: JSON.stringify(result, null, 2)
      }))
    });
  }

  async editEmployee(req: EditEmployeeRequest) {
    const where = eq(employees.id, req.id);
    const oldValue = await this.db.query.employees.findFirst({ where });

    const result = await this.db
      .update(employees)
      .set({
        firstName: req.firstName,
        lastName: req.lastName,
        code: req.code,
        birthDate: req.birthDate,
        organizationId: req.organizationId,
        status: req.status,
        email: req.email,
        phoneNumber: req.phoneNumber,
        country: req.country,
        state: req.state,
        city: req.city,
        line1: req.line1,
        line2: req.line2,
        postalCode: req.postalCode,
        remarks: req.remarks
      })
      .where(eq(employees.id, req.id));

    const newValue = await this.db.query.employees.findFirst({ where });

    this.logService.log({
      category: 'EDIT',
      target: 'EMPLOYEE',
      targetId: result.lastInsertRowid as number,
      oldValue: JSON.stringify(oldValue, null, 2),
      newValue: JSON.stringify(newValue, null, 2)
    });
  }

  async deleteEmployeeById(id: number) {
    const where = eq(employees.id, id);
    const oldValue = await this.db.query.employees.findFirst({ where });

    await this.db.delete(employeeCommendations).where(eq(employeeCommendations.employeeId, id));
    await this.db.delete(employees).where(where);

    this.logService.log({
      category: 'DELETE',
      oldValue: JSON.stringify(oldValue, null, 2),
      target: 'EMPLOYEE',
      targetId: id
    });
  }
}
