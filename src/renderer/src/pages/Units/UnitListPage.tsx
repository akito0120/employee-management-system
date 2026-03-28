import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import OrganizationalUnitStatusTag from '@renderer/components/OrganizationalUnitStatusTag';
import { useFindUnitSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';
import { FindUnitRequest, FindUnitResponse } from 'src/shared/dto/units/find-unit.dto';

const UnitListSearchForm = () => {
  const [form] = Form.useForm<FindUnitRequest>();
  const [params, setParams] = useFindUnitSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('status', values.status);
    setParams('page', 1);
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item<FindUnitRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder="Name" allowClear />
      </Form.Item>

      <Form.Item<FindUnitRequest> name="status" initialValue={params.status ?? undefined}>
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
        <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const UnitListTable = () => {
  const [params, setParams] = useFindUnitSearchParams();
  const { data, isLoading } = trpc.units.findUnit.useQuery(params);

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams('page', page),
        showTotal: (total) => <Typography.Text type="secondary">{total} Results</Typography.Text>
      }}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Unit Code', dataIndex: 'code' },
        {
          title: 'Sub Department',
          dataIndex: 'subDepartment',
          render: (subDept: FindUnitResponse['items'][number]['subDepartment']) => (
            <Typography.Text>{subDept.name}</Typography.Text>
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

const UnitListPage = () => {
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Units' }]} />

      <Flex justify="space-between">
        <UnitListSearchForm />

        <Button
          icon={<PlusOutlined />}
          onClick={() => navigate('/units/register')}
          variant="filled"
          color="primary"
        >
          Register
        </Button>
      </Flex>

      <UnitListTable />
    </Flex>
  );
};

export default UnitListPage;
