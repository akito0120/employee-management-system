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

export const useEmployeeStatusOptions = () => {
  const { t } = useTranslation();
  return [
    { value: 'ACTIVE', label: t('enums.employeeStatus.active') },
    { value: 'ON_LEAVE', label: t('enums.employeeStatus.onLeave') },
    { value: 'SICK_LEAVE', label: t('enums.employeeStatus.sickLeave') },
    { value: 'SUSPENDED', label: t('enums.employeeStatus.suspended') },
    { value: 'PARENTAL_LEAVE', label: t('enums.employeeStatus.parentalLeave') },
    { value: 'NOTICE_PERIOD', label: t('enums.employeeStatus.noticePeriod') },
    { value: 'TERMINATED', label: t('enums.employeeStatus.terminated') }
  ];
};
