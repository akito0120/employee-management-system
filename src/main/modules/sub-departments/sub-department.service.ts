import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { GetOptionsResponse } from '../../../shared/dto/get-options.dto';
import {
  FindSubDepartmentRequest,
  FindSubDepartmentResponse
} from '../../../shared/dto/sub-departments/find-sub-department.dto';
import { FindSubDepartmentByIdResponse } from '../../../shared/dto/sub-departments/find-sub-department-by-id.dto';
import { RegisterSubDepartmentRequest } from '../../../shared/dto/sub-departments/register-sub-department.dto';
import { DatabaseType } from '../../db';
import { NewOrganizationalUnit, organizationalUnits } from '../../db/schema';

@injectable()
export class SubDepartmentService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
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

  async findSubDepartment(req: FindSubDepartmentRequest): Promise<FindSubDepartmentResponse> {
    const where = and(
      ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
      ...(req.subDepartmentCode
        ? [like(organizationalUnits.code, `%${req.subDepartmentCode}%`)]
        : []),
      ...(req.status ? [eq(organizationalUnits.status, req.status)] : []),
      ...(req.departmentId ? [eq(organizationalUnits.parentId, req.departmentId)] : []),
      eq(organizationalUnits.type, 'SUB_DEPARTMENT')
    );

    console.log(req);

    const subDepartments = await this.db.query.organizationalUnits.findMany({
      where,
      with: { parent: true },
      offset: (req.page - 1) * 10,
      limit: 10
    });

    const total = await this.db.$count(organizationalUnits, where);

    return {
      total,
      items: subDepartments.map((subDept) => ({
        id: subDept.id,
        code: subDept.code,
        name: subDept.name,
        status: subDept.status,
        department: {
          id: subDept.parent?.id || 0,
          code: subDept.parent?.code || '',
          name: subDept.parent?.name || ''
        }
      }))
    };
  }

  async getSubDepartmentOptions(): Promise<GetOptionsResponse> {
    const subDepartments = await this.db.query.organizationalUnits.findMany({
      where: eq(organizationalUnits.type, 'SUB_DEPARTMENT'),
      columns: { id: true, name: true, code: true }
    });

    return subDepartments.map((subDept) => ({
      label: `${subDept.name} (${subDept.code})`,
      value: subDept.id
    }));
  }

  async findSubDepartmentById(id: number): Promise<FindSubDepartmentByIdResponse> {
    const subDept = await this.db.query.organizationalUnits.findFirst({
      where: and(eq(organizationalUnits.type, 'SUB_DEPARTMENT'), eq(organizationalUnits.id, id))
    });

    if (!subDept) throw new Error('No such sub department');

    return {
      id: subDept.id,
      name: subDept.name,
      code: subDept.code,
      status: subDept.status,
      description: subDept.description,
      departmentId: subDept.parentId as number
    };
  }
}
