import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const CommendationListPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Commendations and Sanctions' }]} />
    </Flex>
  );
};

export default CommendationListPage;
