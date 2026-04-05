import { Breadcrumb, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import UnitForm from './UnitForm';

const RegisterUnitPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.units') }, { title: t('global.add') }]} />
      <UnitForm editing onCancel={() => navigate(-1)} onSuccess={() => navigate(-1)} />
    </Flex>
  );
};

export default RegisterUnitPage;
