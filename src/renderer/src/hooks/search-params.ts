import { FindDepartmentRequest } from 'src/shared/dto/departments/find-department.dto';
import { FindSubDepartmentRequest } from 'src/shared/dto/sub-departments/find-sub-department.dto';
import { FindUnitRequest } from 'src/shared/dto/units/find-unit.dto';

import { useSearchParamsWithDefaults } from './search-params-with-defaults';

export const useFindDepartmentSearchParams = () => {
  return useSearchParamsWithDefaults<FindDepartmentRequest>({
    departmentCode: null,
    name: null,
    status: null,
    page: 1
  });
};

export const useFindSubDepartmentSearchParams = () => {
  return useSearchParamsWithDefaults<FindSubDepartmentRequest>({
    name: null,
    status: null,
    subDepartmentCode: null,
    departmentId: null,
    page: 1
  });
};

export const useFindUnitSearchParams = () => {
  return useSearchParamsWithDefaults<FindUnitRequest>({
    name: null,
    status: null,
    page: 1
  });
};
