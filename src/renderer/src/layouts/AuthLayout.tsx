import { Card } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { Outlet } from 'react-router-dom';

const AuthLayout = (): JSX.Element => {
  return (
    <Card
      variant="borderless"
      style={{ borderRadius: 0, padding: 0, margin: 0 }}
      styles={{ body: { padding: 0, margin: 0, height: '100vh' } }}
    >
      <Outlet />
    </Card>
  );
};

export default AuthLayout;
