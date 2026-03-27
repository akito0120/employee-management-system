import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { RegisterSubDepartmentRequest } from 'src/shared/dto/sub-departments/register-sub-department.dto';

const RegisterSubDepartmentPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { data: departmentOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.subDepartments.registerSubDepartment.useMutation({
      onSuccess: () => navigate('/sub-departments'),
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
      <Breadcrumb items={[{ title: 'Sub Departments' }, { title: 'Register' }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: 'Name',
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest> name="name" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Sub Department Code',
              children: (
                <Form.Item<RegisterSubDepartmentRequest> name="code" noStyle>
                  <Input style={{ width: '20rem' }} />
                </Form.Item>
              )
            },
            {
              label: 'Department',
              children: (
                <Form.Item<RegisterSubDepartmentRequest> name="departmentId" noStyle>
                  <Select style={{ width: '20rem' }} options={departmentOptions} />
                </Form.Item>
              )
            },
            {
              label: 'Manager',
              children: (
                <Form.Item<RegisterSubDepartmentRequest> noStyle>
                  <Select style={{ width: '20rem' }} disabled />
                </Form.Item>
              )
            },
            {
              label: 'Status',
              children: (
                <Form.Item<RegisterSubDepartmentRequest> name="status" style={{ margin: 0 }}>
                  <Select
                    style={{ width: '20rem' }}
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
                <Form.Item<RegisterSubDepartmentRequest> name="description" style={{ margin: 0 }}>
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
          onClick={() => navigate('/sub-departments')}
        >
          Cancel
        </Button>

        <Button
          icon={<CheckOutlined />}
          variant="filled"
          color="primary"
          onClick={submit}
          loading={registerPending}
        >
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterSubDepartmentPage;
