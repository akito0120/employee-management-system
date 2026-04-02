import { container } from 'tsyringe';
import { z } from 'zod';

import { confirmPromotionRequest } from '../../../shared/dto/employees/confirm-promotion.dto';
import { findEmployeeRequest } from '../../../shared/dto/employees/find-employee.dto';
import { registerEmployeeRequest } from '../../../shared/dto/employees/register-employee.dto';
import t from '../../trpc';
import { EmployeeService } from './employee.service';

const employeeRouter = t.router({
  registerEmployee: t.procedure.input(registerEmployeeRequest).mutation(async (c) => {
    const employeeService = container.resolve(EmployeeService);
    await employeeService.registerEmployee(c.input);
  }),
  findEmployee: t.procedure.input(findEmployeeRequest).query(async (c) => {
    const employeeService = container.resolve(EmployeeService);
    return employeeService.findEmployee(c.input);
  }),
  findEmployeeById: t.procedure.input(z.number()).query(async (c) => {
    const employeeService = container.resolve(EmployeeService);
    return employeeService.findEmployeeById(c.input);
  }),
  confirmRaise: t.procedure.input(z.number()).mutation(async (c) => {
    const service = container.resolve(EmployeeService);
    await service.confirmRaise(c.input);
  }),
  confirmPromotion: t.procedure.input(confirmPromotionRequest).mutation(async (c) => {
    const service = container.resolve(EmployeeService);
    await service.confirmPromotion(c.input);
  }),
  export: t.procedure.mutation(async () => {
    const service = container.resolve(EmployeeService);
    return await service.export();
  })
});

export default employeeRouter;
