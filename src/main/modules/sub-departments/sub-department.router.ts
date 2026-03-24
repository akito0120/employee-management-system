import { container } from 'tsyringe';

import { findSubDepartmentRequest } from '../../../shared/dto/sub-departments/find-sub-department.dto';
import { registerSubDepartmentRequest } from '../../../shared/dto/sub-departments/register-sub-department.dto';
import t from '../../trpc';
import { SubDepartmentService } from './sub-department.service';

const subDepartmentRouter = t.router({
  registerSubDepartment: t.procedure.input(registerSubDepartmentRequest).mutation(async (c) => {
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
  })
});

export default subDepartmentRouter;
