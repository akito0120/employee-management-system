import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

interface TableTotalCountProps {
  total: number;
}

const TableTotalCount = ({ total }: TableTotalCountProps) => {
  const { t } = useTranslation();
  return (
    <Typography.Text type="secondary">
      {total} {t('global.results')}
    </Typography.Text>
  );
};

export default TableTotalCount;
