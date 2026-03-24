import { Breadcrumb, Flex } from 'antd';

const RegisterUnitPage = () => {
  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Units' }, { title: 'Register' }]} />
    </Flex>
  );
};

export default RegisterUnitPage;
