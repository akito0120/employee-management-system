import { trpc } from '@renderer/trpc';
import { Statistic } from 'antd';

export const EmployeeCount = () => {
  const { data, isLoading } = trpc.stats.getEmploteeCount.useQuery();

  return (
    <Statistic title="Total Employee Count" value={data} loading={isLoading} suffix="employees" />
  );
};

export const AverageSalary = () => {
  const { data, isLoading } = trpc.stats.getAverageSalary.useQuery();

  return <Statistic title="Average Salary" value={data} loading={isLoading} prefix="€" />;
};

export const DeptCount = () => {
  const { data, isLoading } = trpc.stats.getDeptCount.useQuery();

  return (
    <Statistic
      title="Total Department Count"
      value={data}
      loading={isLoading}
      suffix="departments"
    />
  );
};

export const SubDeptCount = () => {
  const { data, isLoading } = trpc.stats.getSubDeptCount.useQuery();

  return (
    <Statistic
      title="Total Sub Department Count"
      value={data}
      loading={isLoading}
      suffix="sub departments"
    />
  );
};

export const UnitCount = () => {
  const { data, isLoading } = trpc.stats.getUnitCount.useQuery();

  return <Statistic title="Total Unit Count" value={data} loading={isLoading} suffix="units" />;
};
