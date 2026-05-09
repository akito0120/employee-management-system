import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const institutionNameAtom = atomWithStorage('institution-name', 'My Institution');
const currencyAtom = atomWithStorage('currency', 'EUR');

export const useInstitutionName = () => {
  return useAtom(institutionNameAtom);
};

export const useCurrency = () => {
  return useAtom(currencyAtom);
};
