import { useSearchParams } from 'react-router';

export const useSearchParamsWithDefaults = <T extends Record<string, unknown>>(
  defaultParams: T
): [T, (key: keyof T, value: T[keyof T] | undefined) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentParams = Object.keys(defaultParams).reduce((acc, key) => {
    const value = searchParams.get(key) ?? defaultParams[key];
    return {
      ...acc,
      [key]: typeof defaultParams[key] === 'number' ? Number(value) : value
    };
  }, {} as T);

  const setParam = <K extends keyof T>(key: K, value: T[K] | undefined): void => {
    if (value === undefined || value === '') {
      searchParams.delete(key as string);
    } else {
      searchParams.set(key as string, String(value));
    }
    setSearchParams(searchParams);
  };

  return [currentParams, setParam];
};
