import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Descriptions, Flex, Form, Select } from 'antd';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { RegisterDepartmentRequest } from 'src/shared/dto/departments/register-department.dto';

const RegisterDepartmentPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { mutateAsync: register, isPending: registerPending } =
    trpc.departments.registerDepartment.useMutation({
      onSuccess: () => navigate('/departments'),
      onError: (error) => {
        console.log(error);
        message.error('Failed to register');
      }
    });

  const [form] = Form.useForm<RegisterDepartmentRequest>();

  const submit = async () => {
    const values = await form.validateFields();
    await register(values);
  };

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Departments' }, { title: 'Register' }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: 'Name',
              span: 'filled',
              children: (
                <Form.Item<RegisterDepartmentRequest> name="name" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Department Code',
              children: (
                <Form.Item<RegisterDepartmentRequest> name="code" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Manager',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <Select style={{ width: '100%' }} disabled />
                </Form.Item>
              )
            },
            {
              label: 'Status',
              children: (
                <Form.Item<RegisterDepartmentRequest> name="status" style={{ margin: 0 }}>
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
              label: 'Description',
              span: 'filled',
              children: (
                <Form.Item<RegisterDepartmentRequest> name="description" style={{ margin: 0 }}>
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
          onClick={() => navigate('/departments')}
        >
          Cancel
        </Button>

        <Button
          icon={<CheckOutlined />}
          variant="filled"
          color="primary"
          onClick={() => submit()}
          loading={registerPending}
        >
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterDepartmentPage;
