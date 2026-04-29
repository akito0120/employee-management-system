import { trpc } from '@renderer/trpc';
import { Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

export const EmployeeCount = () => {
  const { data, isLoading } = trpc.stats.getEmploteeCount.useQuery();
  const { t } = useTranslation();

  return (
    <Statistic
      title={t('dashboard.totalEmplCount')}
      value={data}
      loading={isLoading}
      suffix={t('global.employees')}
    />
  );
};

export const AverageSalary = () => {
  const { data, isLoading } = trpc.stats.getAverageSalary.useQuery();
  const { t } = useTranslation();

  return (
    <Statistic
      title={t('dashboard.avgSalary')}
      value={data?.toFixed(0)}
      loading={isLoading}
      prefix="€"
    />
  );
};

export const DeptCount = () => {
  const { data, isLoading } = trpc.stats.getDeptCount.useQuery();
  const { t } = useTranslation();

  return (
    <Statistic
      title={t('dashboard.totalDeptCount')}
      value={data}
      loading={isLoading}
      suffix={t('global.departments')}
    />
  );
};

export const SubDeptCount = () => {
  const { data, isLoading } = trpc.stats.getSubDeptCount.useQuery();
  const { t } = useTranslation();

  return (
    <Statistic
      title={t('dashboard.totalSubDeptCount')}
      value={data}
      loading={isLoading}
      suffix={t('global.subDepartments')}
    />
  );
};

export const UnitCount = () => {
  const { data, isLoading } = trpc.stats.getUnitCount.useQuery();
  const { t } = useTranslation();

  return (
    <Statistic
      title={t('dashboard.totalUnitCount')}
      value={data}
      loading={isLoading}
      suffix={t('global.units')}
    />
  );
};
