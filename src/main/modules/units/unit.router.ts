import { container } from 'tsyringe';

import { findUnitRequest } from '../../../shared/dto/units/find-unit.dto';
import { registerUnitRequest } from '../../../shared/dto/units/register-unit.dto';
import t, { adminProcedure } from '../../trpc';
import { UnitService } from './unit.service';

const unitRouter = t.router({
  registerUnit: adminProcedure.input(registerUnitRequest).mutation(async (c) => {
    const unitService = container.resolve(UnitService);
    await unitService.registerUnit(c.input);
  }),
  findUnit: t.procedure.input(findUnitRequest).query(async (c) => {
    const unitService = container.resolve(UnitService);
    return await unitService.findUnit(c.input);
  }),
  getUnitOptions: t.procedure.query(async () => {
    const unitService = container.resolve(UnitService);
    return unitService.getUnitOptions();
  })
});

export default unitRouter;
