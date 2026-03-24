import { ClearOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import DepartmentStatusTag from '@renderer/components/DepartmentStatusTag';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';

const SubDepartmentListSearchForm = () => {
  return (
    <Form layout="inline">
      <Form.Item name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item name="departmentCode">
        <Input placeholder="Department Code" />
      </Form.Item>

      <Form.Item name="status">
        <Select
          placeholder="Status"
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Closed', value: 'CLOSED' }
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} />
          <Button icon={<ClearOutlined />} />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

const SubDepartmentListActions = () => {
  const navigate = useNavigate();

  return (
    <Space>
      <Button
        icon={<PlusOutlined />}
        onClick={() => navigate('/departments/register')}
        variant="filled"
        color="primary"
      >
        Register
      </Button>
    </Space>
  );
};

const SubDepartmentListTable = () => {
  return (
    <Table
      bordered
      columns={[
        { title: 'Name', dataIndex: 'name' },
        {
          title: 'Sub Department Code',
          dataIndex: 'code',
          render: (departmentCode: string) => (
            <Typography.Text copyable>{departmentCode}</Typography.Text>
          )
        },
        {
          title: 'Department'
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (status: OrganizationalUnitStatus) => <DepartmentStatusTag status={status} />
        },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
    />
  );
};

const SubDepartmentListPage = () => {
  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Sub Departments' }]} />

      <Flex justify="space-between">
        <SubDepartmentListSearchForm />
        <SubDepartmentListActions />
      </Flex>

      <SubDepartmentListTable />
    </Flex>
  );
};

export default SubDepartmentListPage;
