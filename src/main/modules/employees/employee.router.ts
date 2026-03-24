import { container } from 'tsyringe';

import { registerEmployeeRequest } from '../../../shared/dto/employees/register-employee.dto';
import t from '../../trpc';
import { EmployeeService } from './employee.service';

const employeeRouter = t.router({
  registerEmployee: t.procedure.input(registerEmployeeRequest).mutation(async (c) => {
    const employeeService = container.resolve(EmployeeService);
    await employeeService.registerEmployee(c.input);
  })
});

export default employeeRouter;
