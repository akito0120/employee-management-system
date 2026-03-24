import { container } from 'tsyringe';

import { findUnitRequest } from '../../../shared/dto/units/find-unit.dto';
import { registerUnitRequest } from '../../../shared/dto/units/register-unit.dto';
import t from '../../trpc';
import { UnitService } from './unit.service';

const unitRouter = t.router({
  registerUnit: t.procedure.input(registerUnitRequest).mutation(async (c) => {
    const unitService = container.resolve(UnitService);
    await unitService.registerUnit(c.input);
  }),
  findUnit: t.procedure.input(findUnitRequest).query(async (c) => {
    const unitService = container.resolve(UnitService);
    return await unitService.findUnit(c.input);
  })
});

export default unitRouter;
