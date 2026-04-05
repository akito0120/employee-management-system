import { FindCommendationRequest } from 'src/shared/dto/commendations/find-commendation.dto';
import { FindPerformanceEvaluationRequest } from 'src/shared/dto/performance-evaluations/find-performance-evaluation.dto';
import { FindPositionRequest } from 'src/shared/dto/positions/find-position.dto';
import { FindUnitRequest } from 'src/shared/dto/units/find-unit.dto';

import { useSearchParamsWithDefaults } from './search-params-with-defaults';

export const useFindUnitSearchParams = () => {
  return useSearchParamsWithDefaults<FindUnitRequest>({
    name: null,
    status: null,
    page: 1
  });
};

export const useFindPositionSearchParams = () => {
  return useSearchParamsWithDefaults<FindPositionRequest>({
    page: 1,
    code: null,
    name: null
  });
};

export const useFindCommendationSearchParams = () => {
  return useSearchParamsWithDefaults<FindCommendationRequest>({
    page: 1,
    category: null,
    title: null
  });
};

export const useFindPerformanceEvaluationSearchParams = () => {
  return useSearchParamsWithDefaults<FindPerformanceEvaluationRequest>({
    page: 1,
    evaluatedEmployeeId: null,
    evaluatorEmployeeId: null,
    title: null
  });
};
