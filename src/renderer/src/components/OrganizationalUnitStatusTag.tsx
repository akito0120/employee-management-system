import { Tag } from 'antd';
import { JSX } from 'react';
import { OrganizationalUnitStatus } from 'src/main/db/schema';

const organizationalUnitStatusToLabel: Record<OrganizationalUnitStatus, string> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  CLOSED: 'Closed'
};

const organizationalUnitStatusToColor: Record<OrganizationalUnitStatus, string> = {
  ACTIVE: '#1e40af',
  SUSPENDED: '#d97706',
  CLOSED: '#525252'
};

const OrganizationalUnitStatusTag = ({
  status
}: {
  status: OrganizationalUnitStatus;
}): JSX.Element => {
  const color = organizationalUnitStatusToColor[status];
  const label = organizationalUnitStatusToLabel[status];
  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  );
};

export default OrganizationalUnitStatusTag;
