import { container } from 'tsyringe';

import { findPositionRequest } from '../../../shared/dto/positions/find-position.dto';
import { registerPositionRequest } from '../../../shared/dto/positions/register-positions.dto';
import t from '../../trpc';
import { PositionService } from './position.service';

const positionRouter = t.router({
  registerPosition: t.procedure.input(registerPositionRequest).mutation(async (c) => {
    const positionService = container.resolve(PositionService);
    await positionService.registerPosition(c.input);
  }),
  findPosition: t.procedure.input(findPositionRequest).query(async (c) => {
    const positionService = container.resolve(PositionService);
    return positionService.findPosition(c.input);
  }),
  getJobGradeLevelOptions: t.procedure.query(() => {
    const positionService = container.resolve(PositionService);
    return positionService.getJobGradeLevelOptions();
  })
});

export default positionRouter;
