import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import { StyledButton } from '@renderer/components/Buttons';
import OrganizationalUnitStatusTag from '@renderer/components/OrganizationalUnitStatusTag';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table, Typography } from 'antd';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnitStatus } from 'src/main/db/schema';
import {
  FindDepartmentRequest,
  FindDepartmentResponse
} from 'src/shared/dto/departments/find-department.dto';

const findDepartmentSearchParamsAtom = atom<FindDepartmentRequest>({
  name: null,
  statuses: null,
  departmentCode: null,
  page: 1
});

const useFindDepartmentSearchParams = () => {
  return useAtom(findDepartmentSearchParamsAtom);
};

const DepartmentListTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />,
        showSizeChanger: false,
        defaultCurrent: params.page
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
        {
          render: (_, record) => (
            <Button icon={<RightOutlined />} type="text" onClick={() => navigate(`${record.id}`)} />
          )
        }
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
    setParams({ ...values, page: 1 });
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

      <Form.Item<FindDepartmentRequest> name="statuses" initialValue={params.statuses ?? undefined}>
        <Select
          placeholder={t('departments.field.status')}
          options={affiliationStatusOptions}
          style={{ minWidth: '7rem' }}
          styles={{ popup: { root: { width: '10rem' } } }}
          allowClear
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
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
          <StyledButton
            icon={<PlusOutlined />}
            onClick={() => navigate('/departments/register')}
            variant="filled"
            color="primary"
          >
            {t('global.add')}
          </StyledButton>
        </AdminGuard>
      </Flex>

      <DepartmentListTable />
    </Flex>
  );
};

export default DepartmentListPage;
