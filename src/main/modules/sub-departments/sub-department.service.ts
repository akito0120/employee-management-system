import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { FindSubDepartmentRequest } from '../../../shared/dto/sub-departments/find-sub-department.dto';
import { RegisterSubDepartmentRequest } from '../../../shared/dto/sub-departments/register-sub-department.dto';
import { DatabaseType } from '../../db';
import { NewOrganizationalUnit, organizationalUnits } from '../../db/schema';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class SubDepartmentService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async registerSubDepartment(req: RegisterSubDepartmentRequest) {
    const department = await this.db.query.organizationalUnits.findFirst({
      where: and(
        eq(organizationalUnits.id, req.departmentId),
        eq(organizationalUnits.type, 'DEPARTMENT')
      )
    });

    if (!department) throw new Error('No such department');

    const values: NewOrganizationalUnit = {
      name: req.name,
      code: req.code,
      status: req.status,
      description: req.description,
      parentId: req.departmentId,
      type: 'SUB_DEPARTMENT'
    };

    const result = await this.db.insert(organizationalUnits).values(values);
    if (result.changes === 0) throw new Error('Something went wrong');
  }

  async findSubDepartment(req: FindSubDepartmentRequest) {
    return await this.db.query.organizationalUnits.findMany({
      where: and(
        ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
        ...(req.subDepartmentCode
          ? [like(organizationalUnits.name, `%${req.subDepartmentCode}%`)]
          : []),
        ...(req.status ? [eq(organizationalUnits.status, req.status)] : []),
        eq(organizationalUnits.type, 'SUB_DEPARTMENT')
      ),
      with: { parent: true }
    });
  }
}
