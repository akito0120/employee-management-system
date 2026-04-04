import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import OrganizationalUnitStatusTag from '@renderer/components/OrganizationalUnitStatusTag';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { useFindDepartmentSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';
import {
  FindDepartmentRequest,
  FindDepartmentResponse
} from 'src/shared/dto/departments/find-department.dto';

const DepartmentListTable = () => {
  const { t } = useTranslation();
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
        { title: t('departments.field.name'), dataIndex: 'name' },
        {
          title: t('departments.field.code'),
          dataIndex: 'code',
          render: (departmentCode: string) => (
            <Typography.Text copyable>{departmentCode}</Typography.Text>
          )
        },
        {
          title: t('departments.field.status'),
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

const DepartmentListSearchForm = () => {
  const { t } = useTranslation();
  const [params, setParams] = useFindDepartmentSearchParams();
  const [form] = Form.useForm<FindDepartmentRequest>();
  const affiliationStatusOptions = useAffiliationStatusOptions();

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
        <Input placeholder={t('departments.field.name')} allowClear />
      </Form.Item>

      <Form.Item<FindDepartmentRequest>
        name="departmentCode"
        initialValue={params.departmentCode ?? undefined}
      >
        <Input placeholder={t('departments.field.code')} allowClear />
      </Form.Item>

      <Form.Item<FindDepartmentRequest> name="status" initialValue={params.status ?? undefined}>
        <Select
          placeholder={t('departments.field.status')}
          options={affiliationStatusOptions}
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

const DepartmentListPage = () => {
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
            {t('global.add')}
          </Button>
        </AdminGuard>
      </Flex>

      <DepartmentListTable />
    </Flex>
  );
};

export default DepartmentListPage;
