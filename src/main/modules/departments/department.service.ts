import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import {
  FindDepartmentRequest,
  FindDepartmentResponse
} from '../../../shared/dto/departments/find-department.dto';
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
    this.db.transaction((tx) => {
      const values: NewOrganizationalUnit = { ...req, type: 'DEPARTMENT', parentId: null };
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
  }

  async findDepartment(req: FindDepartmentRequest): Promise<FindDepartmentResponse> {
    const where = and(
      eq(organizationalUnits.type, 'DEPARTMENT'),
      ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
      ...(req.departmentCode ? [like(organizationalUnits.code, `%${req.departmentCode}%`)] : []),
      ...(req.status ? [eq(organizationalUnits.status, req.status)] : [])
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
}
