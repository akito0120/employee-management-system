import { container } from 'tsyringe';

import { registerPositionRequest } from '../../../shared/dto/positions/register-positions.dto';
import t from '../../trpc';
import { PositionService } from './position.service';

const positionRouter = t.router({
  registerPosition: t.procedure.input(registerPositionRequest).query(async (c) => {
    const positionService = container.resolve(PositionService);
    await positionService.registerPosition(c.input);
  })
});

export default positionRouter;
