import { trpc } from '@renderer/trpc';
import { useTranslation } from 'react-i18next';

export const useAffiliationOptions = () => {
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();
  const { data: unitOptions } = trpc.units.getUnitOptions.useQuery();
  const { t } = useTranslation();

  return [
    { label: t('global.departments'), options: deptOptions },
    { label: t('global.subDepartments'), options: subDeptOptions },
    { label: t('global.units'), options: unitOptions }
  ];
};
