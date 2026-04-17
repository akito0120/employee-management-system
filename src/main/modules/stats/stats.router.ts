import { container } from 'tsyringe';

import t from '../../trpc';
import { StatsService } from './stats.service';

const statsRouter = t.router({
  getEmploteeCount: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getEmployeeCount();
  }),
  getAverageSalary: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getAverageSalary();
  }),
  getEmployeeCountByDept: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getEmployeeCountByDept();
  })
});

export default statsRouter;
