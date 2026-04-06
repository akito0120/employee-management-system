import { container } from 'tsyringe';
import { z } from 'zod';

import { findPositionRequest } from '../../../shared/dto/positions/find-position.dto';
import { getPositionOptionsRequest } from '../../../shared/dto/positions/get-position-options.dto';
import { registerPositionRequest } from '../../../shared/dto/positions/register-positions.dto';
import t, { adminProcedure } from '../../trpc';
import { PositionService } from './position.service';

const positionRouter = t.router({
  registerPosition: adminProcedure.input(registerPositionRequest).mutation(async (c) => {
    const positionService = container.resolve(PositionService);
    await positionService.registerPosition(c.input);
  }),
  findPosition: t.procedure.input(findPositionRequest).query(async (c) => {
    const positionService = container.resolve(PositionService);
    return positionService.findPosition(c.input);
  }),
  getPositionOptions: t.procedure.input(getPositionOptionsRequest).query(async (c) => {
    const positionService = container.resolve(PositionService);
    return positionService.getPositionOptions(c.input);
  }),
  findPositionById: t.procedure.input(z.number()).query(async (c) => {
    const positionService = container.resolve(PositionService);
    return await positionService.findPositionById(c.input);
  }),
  deletePositionById: adminProcedure.input(z.number()).mutation(async (c) => {
    const service = container.resolve(PositionService);
    await service.deletePositionById(c.input);
  })
});

export default positionRouter;
