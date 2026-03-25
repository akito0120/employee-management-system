import { Tag } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { FindEmployeeByIdResponse } from 'src/shared/dto/employees/get-employee.dto';

type EmployeeStatus = FindEmployeeByIdResponse['status'];

const employeeStatusToLabel: Record<EmployeeStatus, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated',
  NOTICE_PERIOD: 'Notice Period',
  PARENTAL_LEAVE: 'Parental Leave',
  SICK_LEAVE: 'Sick Leave'
};

const employeeStatusToColor: Record<EmployeeStatus, string> = {
  ACTIVE: '#1e40af',
  ON_LEAVE: '#d97706',
  SUSPENDED: '#d97706',
  NOTICE_PERIOD: '#d97706',
  PARENTAL_LEAVE: '#d97706',
  SICK_LEAVE: '#d97706',
  TERMINATED: '#525252'
};

interface Props {
  status: EmployeeStatus;
}

const EmployeeStatusTag = ({ status }: Props): JSX.Element => {
  const color = employeeStatusToColor[status];
  const label = employeeStatusToLabel[status];
  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  );
};

export default EmployeeStatusTag;
