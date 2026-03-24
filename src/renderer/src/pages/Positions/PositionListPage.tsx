import { Breadcrumb, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

const PositionListPage = () => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Positions' }]} />

      <button onClick={() => navigate('/positions/register')}>Register</button>
    </Flex>
  );
};

export default PositionListPage;
