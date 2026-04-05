import { trpc } from '@renderer/trpc';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import jpLocale from 'i18n-iso-countries/langs/ja.json';
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

export const useAffiliationStatusOptions = () => {
  const { t } = useTranslation();

  return [
    { label: t('enums.affiliationStatus.active'), value: 'ACTIVE' },
    { label: t('enums.affiliationStatus.suspended'), value: 'SUSPENDED' },
    { label: t('enums.affiliationStatus.closed'), value: 'CLOSED' }
  ];
};

export const useEligibilityOptions = () => {
  const { t } = useTranslation();

  return [
    { label: t('enums.eligibilities.raise'), value: 'ELIGIBLE_FOR_RAISE' },
    { label: t('enums.eligibilities.promotion'), value: 'ELIGIBLE_FOR_PROMOTION' }
  ];
};

export const useCountryOptions = () => {
  countries.registerLocale(enLocale);
  countries.registerLocale(jpLocale);
  const { i18n } = useTranslation();

  const countryObj = countries.getNames(i18n.language, { select: 'official' });
  return Object.entries(countryObj).map(([code, name]) => ({
    value: code,
    label: name
  }));
};

export const useCommedationCategoryOptions = () => {
  const { t } = useTranslation();

  return [
    { label: t('enums.commendationCategory.commendation'), value: 'COMMENDATION' },
    { label: t('enums.commendationCategory.sanction'), value: 'SANCTION' }
  ];
};

export const useActionTargetOptions = () => {
  const { t } = useTranslation();

  return [
    { label: t('enums.actionTargets.department'), value: 'DEPARTMENT' },
    { label: t('enums.actionTargets.subDepartment'), value: 'SUB_DEPARTMENT' },
    { label: t('enums.actionTargets.unit'), value: 'UNIT' },
    { label: t('enums.actionTargets.position'), value: 'POSITION' },
    { label: t('enums.actionTargets.employee'), value: 'EMPLOYEE' },
    { label: t('enums.actionTargets.commendation'), value: 'COMMENDATION' },
    { label: t('enums.actionTargets.performanceEvaluation'), value: 'PERFORMANCE_EVALUATION' }
  ];
};
