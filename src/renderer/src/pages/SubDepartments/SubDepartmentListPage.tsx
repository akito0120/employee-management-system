import { ClearOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import OrganizationalUnitStatusTag from '@renderer/components/OrganizationalUnitStatusTag';
import { useFindSubDepartmentSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';
import {
  FindSubDepartmentRequest,
  FindSubDepartmentResponse
} from 'src/shared/dto/sub-departments/find-sub-department.dto';

const SubDepartmentListSearchForm = () => {
  const [_, setParams] = useFindSubDepartmentSearchParams();
  const [form] = Form.useForm<FindSubDepartmentRequest>();
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('status', values.status);
    setParams('subDepartmentCode', values.subDepartmentCode);
    setParams('departmentId', values.departmentId);
    setParams('page', 1);
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindSubDepartmentRequest> name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item<FindSubDepartmentRequest> name="subDepartmentCode">
        <Input placeholder="Sub Department Code" />
      </Form.Item>

      <Form.Item<FindSubDepartmentRequest> name="status">
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

      <Form.Item<FindSubDepartmentRequest> name="departmentId">
        <Select options={deptOptions} placeholder="Department" style={{ width: '10rem' }} />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
          <Button icon={<ClearOutlined />} onClick={() => form.resetFields()} />
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
        onClick={() => navigate('/sub-departments/register')}
        variant="filled"
        color="primary"
      >
        Register
      </Button>
    </Space>
  );
};

const SubDepartmentListTable = () => {
  const [params, setParams] = useFindSubDepartmentSearchParams();
  const { data, isLoading } = trpc.subDepartments.findSubDepartment.useQuery(params);

  return (
    <Table<FindSubDepartmentResponse['items'][number]>
      bordered
      loading={isLoading}
      pagination={{
        pageSize: 10,
        onChange: (page) => setParams('page', page),
        total: data?.total,
        showTotal: (total) => <Typography.Text type="secondary">{total} Results</Typography.Text>
      }}
      rowKey={(row) => row.id}
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
          title: 'Department',
          dataIndex: 'department',
          render: (dept: FindSubDepartmentResponse['items'][number]['department']) => (
            <Typography.Text>{dept.name}</Typography.Text>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (status: OrganizationalUnitStatus) => (
            <OrganizationalUnitStatusTag status={status} />
          )
        },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
      dataSource={data?.items}
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
