import { Breadcrumb, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import DepartmentForm from './DepartmentForm';

const RegisterDepartmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.departments') }, { title: t('global.add') }]} />

      <DepartmentForm onCancel={() => navigate(-1)} onSuccess={() => navigate(-1)} editing />
    </Flex>
  );
};

export default RegisterDepartmentPage;
