import { and, eq, inArray, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { GetOptionsResponse } from '../../../shared/dto/get-options.dto';
import { FindUnitRequest, FindUnitResponse } from '../../../shared/dto/units/find-unit.dto';
import { FindUnitByIdResponse } from '../../../shared/dto/units/find-unit-by-id.dto';
import { RegisterUnitRequest } from '../../../shared/dto/units/register-unit.dto';
import { DatabaseType } from '../../db';
import { NewOrganizationalUnit, organizationalUnits } from '../../db/schema';
import { AuditLogService } from '../audit-logs/audit-log.service';

@injectable()
export class UnitService {
  private readonly db: DatabaseType;
  private readonly logService: AuditLogService;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.logService = container.resolve(AuditLogService);
  }

  async registerUnit(req: RegisterUnitRequest): Promise<void> {
    const id = req.id;

    if (id === null || id === undefined) {
      this.db.transaction((tx) => {
        const newUnit: NewOrganizationalUnit = {
          code: req.code,
          name: req.name,
          status: req.status,
          type: 'UNIT',
          description: req.description,
          parentId: req.subDepartmentId
        };

        const result = tx.insert(organizationalUnits).values(newUnit).run();
        const newValue = tx.query.organizationalUnits
          .findFirst({
            where: eq(organizationalUnits.id, result.lastInsertRowid as number)
          })
          .sync();

        this.logService.log({
          tx,
          newValue: JSON.stringify(newValue, null, 2),
          target: 'UNIT',
          category: 'CREATE',
          targetId: result.lastInsertRowid as number
        });
      });
    } else {
      this.db.transaction((tx) => {
        const where = eq(organizationalUnits.id, id);
        const oldValue = tx.query.organizationalUnits.findFirst({ where }).sync();

        this.db
          .update(organizationalUnits)
          .set({
            name: req.name,
            code: req.code,
            description: req.description,
            parentId: req.subDepartmentId,
            status: req.status
          })
          .where(eq(organizationalUnits.id, id))
          .run();

        const newValue = tx.query.organizationalUnits.findFirst({ where }).sync();

        this.logService.log({
          tx,
          oldValue: JSON.stringify(oldValue, null, 2),
          newValue: JSON.stringify(newValue, null, 2),
          target: 'UNIT',
          category: 'EDIT',
          targetId: id
        });
      });
    }
  }

  async findUnit(req: FindUnitRequest): Promise<FindUnitResponse> {
    const where = and(
      eq(organizationalUnits.type, 'UNIT'),
      ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
      ...(req.statuses && req.statuses.length > 0
        ? [inArray(organizationalUnits.status, req.statuses)]
        : []),
      ...(req.subDepartmentIds && req.subDepartmentIds.length > 0
        ? [inArray(organizationalUnits.parentId, req.subDepartmentIds)]
        : [])
    );

    const units = await this.db.query.organizationalUnits.findMany({
      where,
      offset: (req.page - 1) * 10,
      limit: 10,
      with: { parent: true }
    });

    const total = await this.db.$count(organizationalUnits, where);

    return {
      total,
      items: units.map((unit) => ({
        id: unit.id,
        code: unit.code,
        name: unit.name,
        status: unit.status,
        subDepartment: {
          id: unit.parent?.id || 0,
          code: unit.parent?.code || '',
          name: unit.parent?.name || ''
        }
      }))
    };
  }

  async getUnitOptions(): Promise<GetOptionsResponse> {
    const units = await this.db.query.organizationalUnits.findMany({
      where: eq(organizationalUnits.type, 'UNIT'),
      columns: { id: true, name: true, code: true }
    });

    return units.map((unit) => ({ label: `${unit.name} (${unit.code})`, value: unit.id }));
  }

  async findUnitById(id: number): Promise<FindUnitByIdResponse> {
    const unit = await this.db.query.organizationalUnits.findFirst({
      where: and(eq(organizationalUnits.type, 'UNIT'), eq(organizationalUnits.id, id))
    });

    if (!unit) throw new Error('No such unit');

    return {
      id: unit.id,
      name: unit.name,
      code: unit.code,
      status: unit.status,
      description: unit.description,
      subDepartmentId: unit.parentId as number
    };
  }
}
