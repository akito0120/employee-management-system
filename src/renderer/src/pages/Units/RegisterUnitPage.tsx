import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { RegisterUnitRequest } from 'src/shared/dto/units/register-unit.dto';

const RegisterUnitPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterUnitRequest>();
  const { mutateAsync: register, isPending: registerPending } = trpc.units.registerUnit.useMutation(
    {
      onSuccess: () => navigate('/units'),
      onError: (error) => {
        console.log(error);
        message.error('Failed to register');
      }
    }
  );
  const { data: subDepartmentOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();

  const submit = async () => {
    const values = await form.validateFields();
    await register(values);
  };

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Units' }, { title: 'Register' }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: 'Name',
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest> name="name" noStyle>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Unit Code',
              children: (
                <Form.Item<RegisterUnitRequest> name="code" noStyle>
                  <Input style={{ width: '20rem' }} />
                </Form.Item>
              )
            },
            {
              label: 'Sub Department',
              children: (
                <Form.Item<RegisterUnitRequest> noStyle name="subDepartmentId">
                  <Select style={{ width: '20rem' }} options={subDepartmentOptions} />
                </Form.Item>
              )
            },
            {
              label: 'Manager',
              children: (
                <Form.Item<RegisterUnitRequest> noStyle>
                  <Select style={{ width: '20rem' }} disabled />
                </Form.Item>
              )
            },
            {
              label: 'Status',
              children: (
                <Form.Item<RegisterUnitRequest> name="status" noStyle>
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
          onClick={() => navigate('/units')}
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

export default RegisterUnitPage;
