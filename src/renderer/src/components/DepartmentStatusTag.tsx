import { Tag } from 'antd';
import { JSX } from 'react';
import { OrganizationalUnitStatus } from 'src/main/db/schema';

const departmentStatusToLabel: Record<OrganizationalUnitStatus, string> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  CLOSED: 'Closed'
};

const departmentStatusToColor: Record<OrganizationalUnitStatus, string> = {
  ACTIVE: 'blue',
  SUSPENDED: 'orange',
  CLOSED: 'default'
};

const DepartmentStatusTag = ({ status }: { status: OrganizationalUnitStatus }): JSX.Element => {
  const color = departmentStatusToColor[status];
  const label = departmentStatusToLabel[status];
  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  );
};

export default DepartmentStatusTag;
