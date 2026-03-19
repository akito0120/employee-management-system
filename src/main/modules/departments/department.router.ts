import { container } from 'tsyringe';

import { registerDepartmentRequest } from '../../../shared/dto/departments/register-department.dto';
import t from '../../trpc';
import { DepartmentService } from './department.service';

const departmentRouter = t.router({
  registerDepartment: t.procedure.input(registerDepartmentRequest).mutation(async (c) => {
    const departmentService = container.resolve(DepartmentService);
    await departmentService.registerDepartment(c.input);
  })
});

export default departmentRouter;
