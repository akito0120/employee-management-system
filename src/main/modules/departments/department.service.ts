import { and, eq, inArray, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import {
  FindDepartmentRequest,
  FindDepartmentResponse
} from '../../../shared/dto/departments/find-department.dto';
import { FindDepartmentByIdResponse } from '../../../shared/dto/departments/find-department-by-id.dto';
import { RegisterDepartmentRequest } from '../../../shared/dto/departments/register-department.dto';
import { GetOptionsResponse } from '../../../shared/dto/get-options.dto';
import { DatabaseType } from '../../db';
import { NewOrganizationalUnit, organizationalUnits } from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class DepartmentService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  registerDepartment(req: RegisterDepartmentRequest) {
    const id = req.id;
    if (id === undefined || id === null) {
      this.db.transaction((tx) => {
        const values: NewOrganizationalUnit = {
          name: req.name,
          code: req.code,
          status: req.status,
          description: req.description,
          type: 'DEPARTMENT',
          parentId: null
        };
        const result = tx.insert(organizationalUnits).values(values).run();

        const newValue = tx.query.organizationalUnits
          .findFirst({
            where: eq(organizationalUnits.id, result.lastInsertRowid as number)
          })
          .sync();

        this.logService.log({
          tx,
          newValue: JSON.stringify(newValue, null, 2),
          target: 'DEPARTMENT',
          category: 'CREATE',
          targetId: result.lastInsertRowid as number
        });
      });
    } else {
      this.db.transaction((tx) => {
        const where = eq(organizationalUnits.id, id);
        const oldValue = tx.query.organizationalUnits.findFirst({ where }).sync();

        tx.update(organizationalUnits)
          .set({
            name: req.name,
            code: req.code,
            description: req.description,
            status: req.status
          })
          .where(where)
          .run();

        const newValue = tx.query.organizationalUnits.findFirst({ where }).sync();

        this.logService.log({
          tx,
          oldValue: JSON.stringify(oldValue, null, 2),
          newValue: JSON.stringify(newValue, null, 2),
          target: 'DEPARTMENT',
          category: 'EDIT',
          targetId: id
        });
      });
    }
  }

  async findDepartment(req: FindDepartmentRequest): Promise<FindDepartmentResponse> {
    const where = and(
      eq(organizationalUnits.type, 'DEPARTMENT'),
      ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
      ...(req.departmentCode ? [like(organizationalUnits.code, `%${req.departmentCode}%`)] : []),
      ...(req.statuses && req.statuses.length > 0
        ? [inArray(organizationalUnits.status, req.statuses)]
        : [])
    );

    const departments = await this.db.query.organizationalUnits.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10
    });

    const total = await this.db.$count(organizationalUnits, where);

    return {
      total,
      items: departments.map((dept) => ({
        id: dept.id,
        code: dept.code,
        name: dept.name,
        status: dept.status
      }))
    };
  }

  async getDepartmentOptions(): Promise<GetOptionsResponse> {
    const departments = await this.db.query.organizationalUnits.findMany({
      where: eq(organizationalUnits.type, 'DEPARTMENT'),
      columns: { id: true, name: true, code: true }
    });

    return departments.map((department) => ({
      label: `${department.name} (${department.code})`,
      value: department.id
    }));
  }

  async findDepartmentById(id: number): Promise<FindDepartmentByIdResponse> {
    const dept = await this.db.query.organizationalUnits.findFirst({
      where: and(eq(organizationalUnits.type, 'DEPARTMENT'), eq(organizationalUnits.id, id)),
      columns: {
        type: false,
        parentId: false
      }
    });

    if (!dept) throw new Error('No such department was found');

    return {
      ...dept,
      description: dept.description ?? null
    };
  }

  async deleteDepartmentById(id: number) {
    const where = and(eq(organizationalUnits.type, 'DEPARTMENT'), eq(organizationalUnits.id, id));
    const oldValue = await this.db.query.organizationalUnits.findFirst({ where });

    await this.db.delete(organizationalUnits).where(where);

    this.logService.log({
      category: 'DELETE',
      oldValue: JSON.stringify(oldValue, null, 2),
      target: 'DEPARTMENT',
      targetId: id
    });
  }
}
