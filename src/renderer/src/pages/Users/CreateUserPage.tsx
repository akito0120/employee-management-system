import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Checkbox, Descriptions, Flex, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreateUserRequestDto } from 'src/shared/dto/users/create-user.dto';

type FormType = CreateUserRequestDto & {
  confirmPassword: string;
};

const CreateUserPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync } = trpc.users.createUser.useMutation();

  const [form] = Form.useForm<FormType>();
  const password = Form.useWatch<string>('password', form);

  const submit = async () => {
    const { confirmPassword: _, ...values } = await form.validateFields();
    const req = { ...values, isAdmin: values.isAdmin ?? false };
    await mutateAsync(req);
    form.resetFields();
    navigate(-1);
  };

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.users') }]} />

      <Form form={form}>
        <Flex vertical gap="large">
          <Descriptions
            bordered
            column={2}
            items={[
              {
                label: `* ${t('users.field.firstName')}`,
                children: (
                  <Form.Item<FormType> noStyle name="firstName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: `* ${t('users.field.lastName')}`,
                children: (
                  <Form.Item<FormType> noStyle name="lastName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: `* ${t('users.field.email')}`,
                children: (
                  <Form.Item<FormType>
                    noStyle
                    name="email"
                    rules={[{ required: true }, { type: 'email' }]}
                  >
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('users.field.isAdmin'),
                children: (
                  <Form.Item<FormType> noStyle name="isAdmin" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                )
              },
              {
                label: `* ${t('users.field.password')}`,
                children: (
                  <Form.Item<FormType> noStyle name="password" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                )
              },
              {
                label: `* ${t('users.create.confirmPassword')}`,
                children: (
                  <Form.Item<FormType>
                    noStyle
                    name="confirmPassword"
                    rules={[
                      { required: true },
                      {
                        validator: (_, value) => {
                          if (typeof value == 'string' && value === password)
                            return Promise.resolve();
                          return Promise.reject();
                        }
                      }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                )
              }
            ]}
          />

          <Flex gap="middle" justify="center">
            <StyledButton
              variant="filled"
              color="default"
              icon={<LeftOutlined />}
              onClick={() => {
                form.resetFields();
                navigate(-1);
              }}
            >
              {t('global.cancel')}
            </StyledButton>
            <StyledButton
              variant="filled"
              color="primary"
              icon={<CheckOutlined />}
              onClick={submit}
            >
              {t('global.confirm')}
            </StyledButton>
          </Flex>
        </Flex>
      </Form>
    </Flex>
  );
};

export default CreateUserPage;
