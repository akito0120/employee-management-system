import { StyledButton } from '@renderer/components/Buttons';
import { useInstitutionName } from '@renderer/hooks/metadata';
import { trpc } from '@renderer/trpc';
import { App, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from 'src/shared/dto/auth/login.dto';

const LoginPage = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const { message } = App.useApp();
  const { mutate: login, isPending: loginPending } = trpc.auth.login.useMutation({
    onSuccess: () => navigate('/employees'),
    onError: () => message.error('Failed to login')
  });
  const [institutionName] = useInstitutionName();

  const [form] = Form.useForm<LoginRequest>();

  const onFinish = async (): Promise<void> => {
    const json = await form.validateFields();
    login(json);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Flex style={{ height: '100%' }} justify="center" align="center">
      <Card style={{ width: '35%', padding: '2rem' }}>
        <Form<LoginRequest> form={form} onFinish={onFinish}>
          <Form.Item>
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
              {institutionName}
            </Typography.Title>
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              {t('loginPage.title')}
            </Typography.Paragraph>
          </Form.Item>

          <Form.Item<LoginRequest>
            name="email"
            rules={[
              { required: true, message: t('loginPage.emailRequiredValidationError') },
              { type: 'email', message: t('loginPage.emailFormatValidationError') }
            ]}
          >
            <Input placeholder={t('loginPage.emailInputPlaceholder')} />
          </Form.Item>

          <Form.Item<LoginRequest>
            name="password"
            rules={[{ required: true, message: t('loginPage.passwordRequiredValidationError') }]}
          >
            <Input.Password placeholder={t('loginPage.passwordInputPlaceholder')} />
          </Form.Item>

          <Form.Item>
            <StyledButton
              style={{ width: '100%' }}
              variant="filled"
              color="primary"
              htmlType="submit"
              loading={loginPending}
            >
              {t('loginPage.loginButton')}
            </StyledButton>
          </Form.Item>
        </Form>

        <Button onClick={toggleLanguage} style={{ width: '100%' }} variant="text" color="default">
          {t('global.switchLanguageButton')}
        </Button>
      </Card>
    </Flex>
  );
};

export default LoginPage;
