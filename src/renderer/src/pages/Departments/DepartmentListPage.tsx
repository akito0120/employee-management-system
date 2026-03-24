import { ClearOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import DepartmentStatusTag from '@renderer/components/DepartmentStatusTag';
import { useFindDepartmentSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';
import {
  FindDepartmentRequest,
  FindDepartmentResponse
} from 'src/shared/dto/departments/find-department.dto';

const DepartmentListTable = () => {
  const [params, setParams] = useFindDepartmentSearchParams();
  const { data, isLoading } = trpc.departments.findDepartment.useQuery(params);

  return (
    <Table<FindDepartmentResponse['items'][number]>
      rowKey={(row) => row.id}
      bordered
      dataSource={data?.items}
      pagination={{
        pageSize: 10,
        total: data?.total,
        onChange: (page) => setParams('page', page)
      }}
      loading={isLoading}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        {
          title: 'Department Code',
          dataIndex: 'code',
          render: (departmentCode: string) => (
            <Typography.Text copyable>{departmentCode}</Typography.Text>
          )
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

const DepartmentListSearchForm = (): JSX.Element => {
  const [_, setParams] = useFindDepartmentSearchParams();
  const [form] = Form.useForm<FindDepartmentRequest>();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('departmentCode', values.departmentCode);
    setParams('status', values.status);
    setParams('page', 1);
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindDepartmentRequest> name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item<FindDepartmentRequest> name="departmentCode">
        <Input placeholder="Department Code" />
      </Form.Item>

      <Form.Item<FindDepartmentRequest> name="status">
        <Select
          placeholder="Status"
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Closed', value: 'CLOSED' }
          ]}
          style={{ width: '7rem' }}
        />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
          <Button icon={<ClearOutlined />} onClick={() => form.resetFields()} />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

const DepartmentListPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Departments' }]} />

      <Flex justify="space-between">
        <DepartmentListSearchForm />

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
      </Flex>

      <DepartmentListTable />
    </Flex>
  );
};

export default DepartmentListPage;
