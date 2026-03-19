import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const PositionListPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Positions' }]} />
    </Flex>
  );
};

export default PositionListPage;
