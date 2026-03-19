import { FindDepartmentRequest } from 'src/shared/dto/departments/find-department.dto';

import { useSearchParamsWithDefaults } from './search-params-with-defaults';

export const useFindDepartmentSearchParams = () => {
  return useSearchParamsWithDefaults<FindDepartmentRequest>({
    departmentCode: null,
    name: null,
    status: null
  });
};
