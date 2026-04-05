import { Tag } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganizationalUnitStatus } from 'src/main/db/schema';

const OrganizationalUnitStatusTag = ({ status }: { status: OrganizationalUnitStatus }) => {
  const { t } = useTranslation();

  const organizationalUnitStatusToLabel: Record<OrganizationalUnitStatus, string> = useMemo(
    () => ({
      ACTIVE: t('enums.affiliationStatus.active'),
      SUSPENDED: t('enums.affiliationStatus.suspended'),
      CLOSED: t('enums.affiliationStatus.closed')
    }),
    [t]
  );

  const organizationalUnitStatusToColor: Record<OrganizationalUnitStatus, string> = useMemo(
    () => ({
      ACTIVE: 'blue',
      SUSPENDED: 'volcano',
      CLOSED: 'default'
    }),
    []
  );

  const color = organizationalUnitStatusToColor[status];
  const label = organizationalUnitStatusToLabel[status];

  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  );
};

export default OrganizationalUnitStatusTag;
