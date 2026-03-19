import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const RegisterPerformanceEvaluationPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Performance Evaluations' }, { title: 'Register' }]} />
    </Flex>
  );
};

export default RegisterPerformanceEvaluationPage;
