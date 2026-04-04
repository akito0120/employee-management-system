import { Breadcrumb, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SubDepartmentForm from './SubDepartmentForm';

const RegisterSubDepartmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.subDepartments') }, { title: t('global.add') }]} />

      <SubDepartmentForm editing onCancel={() => navigate(-1)} onSuccess={() => navigate(-1)} />
    </Flex>
  );
};

export default RegisterSubDepartmentPage;
