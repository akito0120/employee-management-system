import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import OrganizationalUnitStatusTag from '@renderer/components/OrganizationalUnitStatusTag';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { useFindSubDepartmentSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';
import {
  FindSubDepartmentRequest,
  FindSubDepartmentResponse
} from 'src/shared/dto/sub-departments/find-sub-department.dto';

const SubDepartmentListSearchForm = () => {
  const { t } = useTranslation();
  const [params, setParams] = useFindSubDepartmentSearchParams();
  const [form] = Form.useForm<FindSubDepartmentRequest>();
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const affiliationStatusOptions = useAffiliationStatusOptions();

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
      <Form.Item<FindSubDepartmentRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder={t('subDepartments.field.name')} allowClear />
      </Form.Item>

      <Form.Item<FindSubDepartmentRequest>
        name="subDepartmentCode"
        initialValue={params.subDepartmentCode ?? undefined}
      >
        <Input placeholder={t('subDepartments.field.code')} allowClear />
      </Form.Item>

      <Form.Item<FindSubDepartmentRequest> name="status" initialValue={params.status ?? undefined}>
        <Select
          placeholder={t('subDepartments.field.status')}
          options={affiliationStatusOptions}
          style={{ width: '7rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item<FindSubDepartmentRequest>
        name="departmentId"
        initialValue={params.departmentId ?? undefined}
      >
        <Select
          options={deptOptions}
          placeholder={t('subDepartments.field.department')}
          style={{ width: '10rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const SubDepartmentListTable = () => {
  const { t } = useTranslation();
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
        showTotal: (total) => <TableTotalCount total={total} />
      }}
      rowKey={(row) => row.id}
      columns={[
        { title: t('subDepartments.field.name'), dataIndex: 'name' },
        {
          title: t('subDepartments.field.code'),
          dataIndex: 'code',
          render: (departmentCode: string) => (
            <Typography.Text copyable>{departmentCode}</Typography.Text>
          )
        },
        {
          title: t('subDepartments.field.department'),
          dataIndex: 'department',
          render: (dept: FindSubDepartmentResponse['items'][number]['department']) => (
            <Typography.Text>{dept.name}</Typography.Text>
          )
        },
        {
          title: t('subDepartments.field.status'),
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.subDepartments') }]} />

      <Flex justify="space-between">
        <SubDepartmentListSearchForm />

        <AdminGuard>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/sub-departments/register')}
            variant="filled"
            color="primary"
          >
            {t('global.register')}
          </Button>
        </AdminGuard>
      </Flex>

      <SubDepartmentListTable />
    </Flex>
  );
};

export default SubDepartmentListPage;
