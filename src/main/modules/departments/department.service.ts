import { container, injectable } from 'tsyringe';

import { RegisterDepartmentRequest } from '../../../shared/dto/departments/register-department.dto';
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
}
