import { container } from 'tsyringe';

import { findPositionRequest } from '../../../shared/dto/positions/find-position.dto';
import { getJobGradeLevelOptionsRequest } from '../../../shared/dto/positions/get-job-grade-level-options.dto';
import { getSalaryRangeRequest } from '../../../shared/dto/positions/get-salary-range.dto';
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
  getJobGradeLevelOptions: t.procedure.input(getJobGradeLevelOptionsRequest).query(async (c) => {
    const positionService = container.resolve(PositionService);
    return await positionService.getJobGradeLevelOptions(c.input);
  }),
  getPositionOptions: t.procedure.query(async () => {
    const positionService = container.resolve(PositionService);
    return positionService.getPositionOptions();
  }),
  getSalaryRange: t.procedure.input(getSalaryRangeRequest).query(async (c) => {
    const positionService = container.resolve(PositionService);
    return await positionService.getSalaryRange(c.input);
  })
});

export default positionRouter;
