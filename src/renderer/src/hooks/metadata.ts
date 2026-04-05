import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const institutionNameAtom = atomWithStorage('institution-name', 'My Institution');

export const useInstitutionName = () => {
  return useAtom(institutionNameAtom);
};
