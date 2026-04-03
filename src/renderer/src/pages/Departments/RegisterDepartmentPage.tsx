import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Descriptions, Flex, Form, Select } from 'antd';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RegisterDepartmentRequest } from 'src/shared/dto/departments/register-department.dto';

const RegisterDepartmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { mutateAsync: register, isPending: registerPending } =
    trpc.departments.registerDepartment.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error('Failed to register')
    });
  const affiliationStatusOptions = useAffiliationStatusOptions();

  const [form] = Form.useForm<RegisterDepartmentRequest>();

  const submit = async () => {
    const values = await form.validateFields();
    await register(values);
  };

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.departments') }, { title: t('global.register') }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('departments.field.name')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('departments.field.code')}`,
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('departments.field.status')}`,
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="status"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: '100%' }} options={affiliationStatusOptions} />
                </Form.Item>
              )
            },
            {
              label: t('departments.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterDepartmentRequest> name="description" noStyle>
                  <TextArea autoSize={{ minRows: 5 }} />
                </Form.Item>
              )
            }
          ]}
        />
      </Form>

      <Flex justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          variant="filled"
          color="default"
          onClick={() => navigate(-1)}
        >
          {t('global.cancel')}
        </Button>

        <Button
          icon={<CheckOutlined />}
          variant="filled"
          color="primary"
          onClick={() => submit()}
          loading={registerPending}
        >
          {t('global.register')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterDepartmentPage;
