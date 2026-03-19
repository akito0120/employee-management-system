import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { FindDepartmentRequest } from '../../../shared/dto/departments/find-department.dto';
import { RegisterDepartmentRequest } from '../../../shared/dto/departments/register-department.dto';
import { DatabaseType } from '../../db';
import { NewOrganizationalUnit, OrganizationalUnit, organizationalUnits } from '../../db/schema';
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

  async findDepartment(req: FindDepartmentRequest): Promise<OrganizationalUnit[]> {
    return this.db.query.organizationalUnits.findMany({
      where: and(
        ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
        ...(req.departmentCode ? [like(organizationalUnits.code, `%${req.departmentCode}%`)] : []),
        ...(req.status ? [eq(organizationalUnits.status, req.status)] : [])
      )
    });
  }
}
