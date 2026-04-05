import { DeleteOutlined, EditOutlined, IdcardOutlined, PlusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface AuditLogActionCategoryLabelProps {
  category: string;
}

const AuditLogActionCategoryLabel = ({ category }: AuditLogActionCategoryLabelProps) => {
  const { t } = useTranslation();
  const label = useMemo(() => {
    if (category === 'AUTH') return t('enums.actionCategory.auth');
    else if (category === 'CREATE') return t('enums.actionCategory.create');
    else if (category === 'EDIT') return t('enums.actionCategory.edit');
    else if (category === 'DELETE') return t('enums.actionCategory.delete');
    return null;
  }, [category, t]);

  const icon = useMemo(() => {
    if (category === 'AUTH') return <IdcardOutlined size={15} style={{ marginRight: '10px' }} />;
    else if (category === 'CREATE') return <PlusOutlined style={{ marginRight: '10px' }} />;
    else if (category === 'EDIT') return <EditOutlined style={{ marginRight: '10px' }} />;
    else if (category === 'DELETE') return <DeleteOutlined style={{ marginRight: '10px' }} />;
    return null;
  }, [category]);

  return (
    <Typography.Text>
      {icon} {label}
    </Typography.Text>
  );
};

export default AuditLogActionCategoryLabel;
