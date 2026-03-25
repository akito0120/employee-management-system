import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const RegisterRewardPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Rewards and Disciplinary Actions' }, { title: 'Register' }]} />
    </Flex>
  );
};

export default RegisterRewardPage;
