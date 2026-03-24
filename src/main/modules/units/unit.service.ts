import { and, eq, like } from 'drizzle-orm';
import { container, injectable } from 'tsyringe';

import { GetOptionsResponse } from '../../../shared/dto/get-options.dto';
import { FindUnitRequest, FindUnitResponse } from '../../../shared/dto/units/find-unit.dto';
import { RegisterUnitRequest } from '../../../shared/dto/units/register-unit.dto';
import { DatabaseType } from '../../db';
import { NewOrganizationalUnit, organizationalUnits } from '../../db/schema';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class UnitService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async registerUnit(req: RegisterUnitRequest): Promise<void> {
    const newUnit: NewOrganizationalUnit = {
      code: req.code,
      name: req.name,
      status: req.status,
      type: 'UNIT',
      description: req.description,
      parentId: req.subDepartmentId
    };

    const result = await this.db.insert(organizationalUnits).values(newUnit);
    if (result.changes === 0) throw new Error('Something went wrong');
  }

  async findUnit(req: FindUnitRequest): Promise<FindUnitResponse> {
    const where = and(
      eq(organizationalUnits.type, 'UNIT'),
      ...(req.name ? [like(organizationalUnits.name, `%${req.name}%`)] : []),
      ...(req.status ? [eq(organizationalUnits.status, req.status)] : [])
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
      columns: { id: true, name: true }
    });

    return units.map((unit) => ({ label: unit.name, value: unit.id }));
  }
}
