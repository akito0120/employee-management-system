import { Tag } from 'antd';
import { JSX } from 'react';

enum DepartmentStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Closed = 'CLOSED'
}

const departmentStatusToLabel: Record<DepartmentStatus, string> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  CLOSED: 'Closed'
};

const departmentStatusToColor: Record<DepartmentStatus, string> = {
  ACTIVE: 'blue',
  SUSPENDED: 'orange',
  CLOSED: 'default'
};

const DepartmentStatusTag = ({ status }: { status: DepartmentStatus }): JSX.Element => {
  const color = departmentStatusToColor[status];
  const label = departmentStatusToLabel[status];
  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  );
};

export default DepartmentStatusTag;
