import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RegisterUnitRequest } from 'src/shared/dto/units/register-unit.dto';

const RegisterUnitPage = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterUnitRequest>();
  const { mutateAsync: register, isPending: registerPending } = trpc.units.registerUnit.useMutation(
    {
      onSuccess: () => navigate(-1),
      onError: () => message.error('Failed to register')
    }
  );
  const { data: subDepartmentOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();

  const submit = async () => {
    const values = await form.validateFields();
    await register(values);
  };

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.units') }, { title: t('global.register') }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('units.field.name')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest> name="name" noStyle rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('units.field.code')}`,
              children: (
                <Form.Item<RegisterUnitRequest> name="code" noStyle rules={[{ required: true }]}>
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('units.field.status')}`,
              children: (
                <Form.Item<RegisterUnitRequest> name="status" noStyle rules={[{ required: true }]}>
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Suspended', value: 'SUSPENDED' },
                      { label: 'Closed', value: 'CLOSED' }
                    ]}
                  />
                </Form.Item>
              )
            },
            {
              label: `* ${t('units.field.subDepartment')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest>
                  noStyle
                  name="subDepartmentId"
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: '100%' }} options={subDepartmentOptions} />
                </Form.Item>
              )
            },
            {
              label: t('units.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest> name="description" noStyle>
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
          onClick={submit}
          loading={registerPending}
        >
          {t('global.register')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterUnitPage;
