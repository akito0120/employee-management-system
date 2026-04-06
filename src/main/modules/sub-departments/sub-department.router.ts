import { container } from 'tsyringe';
import { z } from 'zod';

import { findSubDepartmentRequest } from '../../../shared/dto/sub-departments/find-sub-department.dto';
import { registerSubDepartmentRequest } from '../../../shared/dto/sub-departments/register-sub-department.dto';
import t, { adminProcedure } from '../../trpc';
import { SubDepartmentService } from './sub-department.service';

const subDepartmentRouter = t.router({
  registerSubDepartment: adminProcedure.input(registerSubDepartmentRequest).mutation(async (c) => {
    const subDepartmentService = container.resolve(SubDepartmentService);
    await subDepartmentService.registerSubDepartment(c.input);
  }),
  findSubDepartment: t.procedure.input(findSubDepartmentRequest).query(async (c) => {
    const subDepartmentService = container.resolve(SubDepartmentService);
    return await subDepartmentService.findSubDepartment(c.input);
  }),
  getSubDepartmentOptions: t.procedure.query(async () => {
    const subDepartmentService = container.resolve(SubDepartmentService);
    return subDepartmentService.getSubDepartmentOptions();
  }),
  findSubDepartmentById: t.procedure.input(z.number()).query(async (c) => {
    const service = container.resolve(SubDepartmentService);
    return await service.findSubDepartmentById(c.input);
  }),
  deleteSubDepartmentById: adminProcedure.input(z.number()).mutation(async (c) => {
    const service = container.resolve(SubDepartmentService);
    await service.deleteSubDepartmentById(c.input);
  })
});

export default subDepartmentRouter;
