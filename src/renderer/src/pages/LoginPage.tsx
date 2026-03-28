import { trpc } from '@renderer/trpc';
import { App, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from 'src/shared/dto/auth/login.dto';

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { mutate: login, isPending: loginPending } = trpc.auth.login.useMutation({
    onSuccess: () => navigate('/employees'),
    onError: () => message.error('Failed to login')
  });

  const [form] = Form.useForm<LoginRequest>();

  const onFinish = async (): Promise<void> => {
    const json = await form.validateFields();
    login(json);
  };

  return (
    <Flex style={{ height: '100%' }} justify="center" align="center">
      <Card style={{ width: '30%', padding: '2rem' }}>
        <Form<LoginRequest> form={form} onFinish={onFinish}>
          <Form.Item>
            <Typography.Title level={3}>Employee Management System</Typography.Title>
          </Form.Item>

          <Form.Item<LoginRequest> name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input placeholder="email" />
          </Form.Item>

          <Form.Item<LoginRequest> name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="password" />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: '100%' }}
              variant="filled"
              color="primary"
              htmlType="submit"
              loading={loginPending}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
