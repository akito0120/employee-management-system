import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const RegisterCommendationPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Commendations and Sanctions' }, { title: 'Issue' }]} />
    </Flex>
  );
};

export default RegisterCommendationPage;
