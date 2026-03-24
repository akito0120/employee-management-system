import { Breadcrumb, Flex } from 'antd';

const UnitListPage = () => {
  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Units' }]} />
    </Flex>
  );
};

export default UnitListPage;
