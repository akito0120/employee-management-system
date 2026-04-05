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
      ACTIVE: 'blue',
      ON_LEAVE: 'volcano',
      SUSPENDED: 'volcano',
      NOTICE_PERIOD: 'volcano',
      PARENTAL_LEAVE: 'volcano',
      SICK_LEAVE: 'volcano',
      TERMINATED: 'default'
    }),
    []
  );

  const color = employeeStatusToColor[status];
  const label = employeeStatusToLabel[status];
  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  );
};

export default EmployeeStatusTag;
