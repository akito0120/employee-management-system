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
import { FindUnitRequest, FindUnitResponse } from 'src/shared/dto/units/find-unit.dto';

const findUnitSearchParamsAtom = atom<FindUnitRequest>({
  name: null,
  statuses: null,
  subDepartmentIds: null,
  page: 1
});

const useFindUnitSearchParams = () => {
  return useAtom(findUnitSearchParamsAtom);
};

const UnitListSearchForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FindUnitRequest>();
  const [params, setParams] = useFindUnitSearchParams();
  const affiliationStatusOptions = useAffiliationStatusOptions();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();

  const search = async () => {
    const values = await form.validateFields();
    setParams({ ...values, page: 1 });
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item<FindUnitRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder={t('units.field.code')} allowClear />
      </Form.Item>

      <Form.Item<FindUnitRequest> name="statuses" initialValue={params.statuses ?? undefined}>
        <Select
          placeholder={t('units.field.status')}
          options={affiliationStatusOptions}
          style={{ minWidth: '7rem' }}
          allowClear
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
        />
      </Form.Item>

      <Form.Item<FindUnitRequest>
        name="subDepartmentIds"
        initialValue={params.subDepartmentIds ?? undefined}
      >
        <Select
          placeholder={t('units.field.subDepartment')}
          options={subDeptOptions}
          style={{ minWidth: '10rem' }}
          styles={{ popup: { root: { width: '20rem' } } }}
          allowClear
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const UnitListTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />,
        showSizeChanger: false,
        defaultCurrent: params.page
      }}
      columns={[
        { title: t('units.field.name'), dataIndex: 'name' },
        { title: t('units.field.code'), dataIndex: 'code' },
        {
          title: t('units.field.subDepartment'),
          dataIndex: 'subDepartment',
          render: (subDept: FindUnitResponse['items'][number]['subDepartment']) => (
            <Typography.Text>{subDept.name}</Typography.Text>
          )
        },
        {
          title: t('units.field.status'),
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

const UnitListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.units') }]} />

      <Flex justify="space-between">
        <UnitListSearchForm />

        <AdminGuard>
          <StyledButton
            icon={<PlusOutlined />}
            onClick={() => navigate('/units/register')}
            variant="filled"
            color="primary"
          >
            {t('global.add')}
          </StyledButton>
        </AdminGuard>
      </Flex>

      <UnitListTable />
    </Flex>
  );
};

export default UnitListPage;
