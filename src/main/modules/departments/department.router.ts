import { container } from 'tsyringe';
import { z } from 'zod';

import { findDepartmentRequest } from '../../../shared/dto/departments/find-department.dto';
import { registerDepartmentRequest } from '../../../shared/dto/departments/register-department.dto';
import t, { adminProcedure } from '../../trpc';
import { DepartmentService } from './department.service';

const departmentRouter = t.router({
  registerDepartment: adminProcedure.input(registerDepartmentRequest).mutation(async (c) => {
    const departmentService = container.resolve(DepartmentService);
    await departmentService.registerDepartment(c.input);
  }),
  findDepartment: t.procedure.input(findDepartmentRequest).query(async (c) => {
    const departmentService = container.resolve(DepartmentService);
    return await departmentService.findDepartment(c.input);
  }),
  getDepartmentOptions: t.procedure.query(async () => {
    const departmentService = container.resolve(DepartmentService);
    return departmentService.getDepartmentOptions();
  }),
  findDepartmentById: t.procedure.input(z.number()).query(async (c) => {
    const service = container.resolve(DepartmentService);
    return await service.findDepartmentById(c.input);
  }),
  deleteDepartmentById: adminProcedure.input(z.number()).mutation(async (c) => {
    const service = container.resolve(DepartmentService);
    await service.deleteDepartmentById(c.input);
  })
});

export default departmentRouter;
