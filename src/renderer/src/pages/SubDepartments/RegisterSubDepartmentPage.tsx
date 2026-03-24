import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';

const RegisterSubDepartmentPage = () => {
  const navigate = useNavigate();
  const { data: departmentOptions, isLoading } = trpc.departments.getDepartmentOptions.useQuery();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Sub Departments' }, { title: 'Register' }]} />

      <Form variant="filled">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: 'Name',
              span: 'filled',
              children: (
                <Form.Item name="name" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Sub Department Code',
              children: (
                <Form.Item name="code" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Department',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <Select
                    style={{ width: '100%' }}
                    options={departmentOptions}
                    loading={isLoading}
                  />
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
                <Form.Item name="status" style={{ margin: 0 }}>
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
                <Form.Item name="description" style={{ margin: 0 }}>
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

        <Button icon={<CheckOutlined />} variant="filled" color="primary">
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterSubDepartmentPage;
