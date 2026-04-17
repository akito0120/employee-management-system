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
  }),
  getEmployeeCountByStatus: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getEmployeeCountByStatus();
  }),
  getDeptCount: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getDeptCount();
  }),
  getSubDeptCount: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getSubDeptCount();
  }),
  getUnitCount: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getUnitCount();
  }),
  getEmployeeCountByJobGrade: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getEmployeeCountByJobGrade();
  }),
  getActivitieStats: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getActivitieStats();
  }),
  getAverageSalaryByDept: t.procedure.query(async () => {
    const service = container.resolve(StatsService);
    return await service.getAverageSalaryByDept();
  })
});

export default statsRouter;
