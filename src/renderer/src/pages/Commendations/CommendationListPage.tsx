import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';

const CommendationListPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Commendations and Sanctions' }]} />

      <button onClick={() => navigate('/commendations/register')}>Register</button>
    </Flex>
  );
};

export default CommendationListPage;
