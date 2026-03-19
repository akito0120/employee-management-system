import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const PerformanceEvaluationListPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Performance Evaluations' }]} />
    </Flex>
  );
};

export default PerformanceEvaluationListPage;
