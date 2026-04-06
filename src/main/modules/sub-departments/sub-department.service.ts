import { and, eq, inArray, like } from 'drizzle-orm';
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
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class SubDepartmentService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  async registerSubDepartment(req: RegisterSubDepartmentRequest) {
    const id = req.id;

    if (id === undefined || id === null) {
      this.db.transaction((tx) => {
        const values: NewOrganizationalUnit = {
          name: req.name,
          code: req.code,
          status: req.status,
          description: req.description,
          parentId: req.departmentId,
          type: 'SUB_DEPARTMENT'
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
          target: 'SUB_DEPARTMENT',
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
            status: req.status,
            description: req.description,
            parentId: req.departmentId
          })
          .where(eq(organizationalUnits.id, id))
          .run();

        const newValue = tx.query.organizationalUnits.findFirst({ where }).sync();

        this.logService.log({
          tx,
          oldValue: JSON.stringify(oldValue, null, 2),
          newValue: JSON.stringify(newValue, null, 2),
          target: 'SUB_DEPARTMENT',
          category: 'EDIT',
          targetId: id
        });
      });
    }
  }

  async findSubDepartment(req: FindSubDepartmentRequest): Promise<FindSubDepartmentResponse> {
    const where = and(
      ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
      ...(req.subDepartmentCode
        ? [like(organizationalUnits.code, `%${req.subDepartmentCode}%`)]
        : []),
      ...(req.statuses && req.statuses.length > 0
        ? [inArray(organizationalUnits.status, req.statuses)]
        : []),
      ...(req.departmentIds && req.departmentIds.length > 0
        ? [inArray(organizationalUnits.parentId, req.departmentIds)]
        : []),
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

  async deleteSubDepartmentById(id: number) {
    const where = and(
      eq(organizationalUnits.type, 'SUB_DEPARTMENT'),
      eq(organizationalUnits.id, id)
    );
    const oldValue = await this.db.query.organizationalUnits.findFirst({ where });

    await this.db.delete(organizationalUnits).where(where);

    this.logService.log({
      category: 'DELETE',
      oldValue: JSON.stringify(oldValue, null, 2),
      target: 'SUB_DEPARTMENT',
      targetId: id
    });
  }
}
