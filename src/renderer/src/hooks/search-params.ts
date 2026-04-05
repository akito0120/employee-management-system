import { FindCommendationRequest } from 'src/shared/dto/commendations/find-commendation.dto';
import { FindPerformanceEvaluationRequest } from 'src/shared/dto/performance-evaluations/find-performance-evaluation.dto';

import { useSearchParamsWithDefaults } from './search-params-with-defaults';

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
