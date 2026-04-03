import { Tag } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FindEmployeeByIdResponse } from 'src/shared/dto/employees/get-employee.dto';

type EmployeeStatus = FindEmployeeByIdResponse['status'];

interface Props {
  status: EmployeeStatus;
}

const EmployeeStatusTag = ({ status }: Props) => {
  const { t } = useTranslation();

  const employeeStatusToLabel: Record<EmployeeStatus, string> = useMemo(
    () => ({
      ACTIVE: t('enums.employeeStatus.active'),
      ON_LEAVE: t('enums.employeeStatus.onLeave'),
      SUSPENDED: t('enums.employeeStatus.suspended'),
      TERMINATED: t('enums.employeeStatus.terminated'),
      NOTICE_PERIOD: t('enums.employeeStatus.noticePeriod'),
      PARENTAL_LEAVE: t('enums.employeeStatus.parentalLeave'),
      SICK_LEAVE: t('enums.employeeStatus.sickLeave')
    }),
    [t]
  );

  const employeeStatusToColor: Record<EmployeeStatus, string> = useMemo(
    () => ({
      ACTIVE: '#1e40af',
      ON_LEAVE: '#d97706',
      SUSPENDED: '#d97706',
      NOTICE_PERIOD: '#d97706',
      PARENTAL_LEAVE: '#d97706',
      SICK_LEAVE: '#d97706',
      TERMINATED: '#525252'
    }),
    []
  );

  const color = employeeStatusToColor[status];
  const label = employeeStatusToLabel[status];
  return (
    <Tag color={color} variant="filled">
      {label}
    </Tag>
  );
};

export default EmployeeStatusTag;
