import { Breadcrumb, Flex } from 'antd';

const DashboardPage = () => {
  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Dashboard' }]} />
    </Flex>
  );
};

export default DashboardPage;
