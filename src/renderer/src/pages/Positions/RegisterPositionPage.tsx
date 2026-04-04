import { Breadcrumb, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import PositionForm from './PositionForm';

const RegisterPositionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.positions') }, { title: t('global.add') }]} />
      <PositionForm editing onCancel={() => navigate(-1)} onSuccess={() => navigate(-1)} />
    </Flex>
  );
};

export default RegisterPositionPage;
