import { container } from 'tsyringe';

import { registerSubDepartmentRequest } from '../../../shared/dto/sub-departments/register-sub-department.dto';
import t from '../../trpc';
import { SubDepartmentService } from './sub-department.service';

const subDepartmentRouter = t.router({
  registerSubDepartment: t.procedure.input(registerSubDepartmentRequest).mutation(async (c) => {
    const subDepartmentService = container.resolve(SubDepartmentService);
    await subDepartmentService.registerSubDepartment(c.input);
  }),
  findSubDepartment: t.procedure.query(() => {})
});

export default subDepartmentRouter;
