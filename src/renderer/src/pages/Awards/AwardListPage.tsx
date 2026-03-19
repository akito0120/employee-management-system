import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const AwardListPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Awards and Disciplinary Actions' }]} />
    </Flex>
  );
};

export default AwardListPage;
