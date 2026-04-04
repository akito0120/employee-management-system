import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RegisterSubDepartmentRequest } from 'src/shared/dto/sub-departments/register-sub-department.dto';

const RegisterSubDepartmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { data: departmentOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const affiliationStatusOptions = useAffiliationStatusOptions();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.subDepartments.registerSubDepartment.useMutation({
      onSuccess: () => navigate(-1),
      onError: (error) => {
        console.log(error);
        message.error('Failed to register');
      }
    });
  const [form] = Form.useForm<RegisterSubDepartmentRequest>();

  const submit = async () => {
    const values = await form.validateFields();
    await register(values);
  };

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.subDepartments') }, { title: t('global.add') }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('subDepartments.field.name')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('subDepartments.field.code')}`,
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('subDepartments.field.status')}`,
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="status"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: '100%' }} options={affiliationStatusOptions} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('subDepartments.field.status')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="departmentId"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: '100%' }} options={departmentOptions} />
                </Form.Item>
              )
            },
            {
              label: t('subDepartments.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest> name="description" noStyle>
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
          {t('global.confirm')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterSubDepartmentPage;
