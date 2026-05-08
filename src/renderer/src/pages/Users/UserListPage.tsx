import { Breadcrumb, Button, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UserListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.users') }]} />

      <Button onClick={() => navigate('create')}>{t('global.add')}</Button>
    </Flex>
  );
};

export default UserListPage;
