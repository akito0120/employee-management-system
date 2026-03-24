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
import { SessionInfo } from '../auth/session-info';

@injectable()
export class DepartmentService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async registerDepartment(req: RegisterDepartmentRequest): Promise<void> {
    const values: NewOrganizationalUnit = { ...req, type: 'DEPARTMENT', parentId: null };
    const result = await this.db.insert(organizationalUnits).values(values);
    if (result.changes === 0) throw new Error('Something went wrong');
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
      where: eq(organizationalUnits.type, 'DEPARTMENT')
    });

    return departments.map((department) => ({
      label: `${department.name} (${department.code})`,
      value: department.id
    }));
  }
}
