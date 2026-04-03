import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import OrganizationalUnitStatusTag from '@renderer/components/OrganizationalUnitStatusTag';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useFindDepartmentSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table, Typography } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';
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
        onChange: (page) => setParams('page', page),
        showTotal: (total) => <TableTotalCount total={total} />
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
          render: (status: OrganizationalUnitStatus) => (
            <OrganizationalUnitStatusTag status={status} />
          )
        },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
    />
  );
};

const DepartmentListSearchForm = (): JSX.Element => {
  const [params, setParams] = useFindDepartmentSearchParams();
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
      <Form.Item<FindDepartmentRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder="Name" allowClear />
      </Form.Item>

      <Form.Item<FindDepartmentRequest>
        name="departmentCode"
        initialValue={params.departmentCode ?? undefined}
      >
        <Input placeholder="Department Code" allowClear />
      </Form.Item>

      <Form.Item<FindDepartmentRequest> name="status" initialValue={params.status ?? undefined}>
        <Select
          placeholder="Status"
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Closed', value: 'CLOSED' }
          ]}
          style={{ width: '7rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const DepartmentListPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.departments') }]} />

      <Flex justify="space-between">
        <DepartmentListSearchForm />

        <AdminGuard>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/departments/register')}
            variant="filled"
            color="primary"
          >
            {t('global.register')}
          </Button>
        </AdminGuard>
      </Flex>

      <DepartmentListTable />
    </Flex>
  );
};

export default DepartmentListPage;
