import { Breadcrumb, Button, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';

const PerformanceEvaluationListPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Performance Evaluations' }]} />

      <Button variant="filled" color="primary" onClick={() => navigate('register')}>
        Register
      </Button>
    </Flex>
  );
};

export default PerformanceEvaluationListPage;
