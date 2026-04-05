import { ImportOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import TableTotalCount from '@renderer/components/TableTotalCount';
import {
  useAffiliationOptions,
  useEligibilityOptions,
  useEmployeeStatusOptions
} from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from 'src/shared/dto/employees/find-employee.dto';

import ExportEmployeeModal from './ExportEmployeeModal';

const findEmployeeSearchParams = atom<FindEmployeeRequest>({
  page: 1,
  name: null,
  code: null,
  organizationIds: null,
  statuses: null,
  eligibilities: null
});

const useFindEmployeeSearchParams = () => {
  return useAtom(findEmployeeSearchParams);
};

const EmployeeListSearchForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FindEmployeeRequest>();
  const [params, setParams] = useFindEmployeeSearchParams();
  const affiliationOptions = useAffiliationOptions();
  const employeeStatusOptions = useEmployeeStatusOptions();
  const eligibilityOptions = useEligibilityOptions();

  const search = async () => {
    const values = await form.validateFields();
    setParams({ ...values, page: 1 });
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindEmployeeRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder={t('employees.field.name')} allowClear />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="code" initialValue={params.code ?? undefined}>
        <Input placeholder={t('employees.field.code')} allowClear />
      </Form.Item>

      <Form.Item<FindEmployeeRequest>
        name="organizationIds"
        initialValue={params.organizationIds ?? undefined}
      >
        <Select
          options={affiliationOptions}
          placeholder={t('employees.field.affiliation')}
          style={{ minWidth: '7rem' }}
          allowClear
          styles={{ popup: { root: { width: '20rem' } } }}
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
        />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="statuses" initialValue={params.statuses ?? undefined}>
        <Select
          options={employeeStatusOptions}
          placeholder={t('employees.field.status')}
          style={{ minWidth: '7rem' }}
          allowClear
          mode="multiple"
          maxTagCount={1}
          styles={{ popup: { root: { width: '15rem' } } }}
          maxTagTextLength={5}
        />
      </Form.Item>

      <Form.Item<FindEmployeeRequest>
        name="eligibilities"
        initialValue={params.eligibilities ?? undefined}
      >
        <Select
          placeholder={t('employees.searchForm.eligibilitiesPlaceholder')}
          style={{ minWidth: '7rem' }}
          mode="multiple"
          options={eligibilityOptions}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const EmployeeListTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useFindEmployeeSearchParams();
  const { data, isLoading } = trpc.employees.findEmployee.useQuery(params);

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      columns={[
        {
          title: t('employees.field.name'),
          render: (_, record) => (
            <Typography.Text>
              {record.firstName} {record.lastName}
            </Typography.Text>
          )
        },
        {
          title: t('employees.field.code'),
          dataIndex: 'code',
          render: (code: string) => <Typography.Text>{code}</Typography.Text>
        },
        {
          title: t('employees.field.affiliation'),
          dataIndex: 'affiliation'
        },
        {
          title: t('employees.field.status'),
          dataIndex: 'status',
          render: (status: FindEmployeeResponse['items'][number]['status']) => (
            <EmployeeStatusTag status={status} />
          )
        },
        {
          title: t('employees.field.email'),
          dataIndex: 'email',
          render: (email: string | null) =>
            email ? <Typography.Text copyable>{email}</Typography.Text> : null
        },
        {
          dataIndex: 'id',
          render: (id: string) => (
            <Button
              icon={<RightOutlined />}
              type="text"
              onClick={() => navigate(`/employees/${id}`)}
            />
          )
        }
      ]}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />
      }}
      rowKey={(row) => row.id}
    />
  );
};

const EmployeeListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.employees') }]} />

      <Flex justify="space-between" vertical gap="middle">
        <Space>
          <StyledButton
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/register')}
            variant="filled"
            color="primary"
          >
            {t('global.register')}
          </StyledButton>
          <StyledButton
            icon={<ImportOutlined />}
            onClick={() => navigate('/employees/import')}
            variant="filled"
            color="primary"
          >
            {t('global.import')}
          </StyledButton>
          <ExportEmployeeModal />
        </Space>

        <EmployeeListSearchForm />
      </Flex>

      <EmployeeListTable />
    </Flex>
  );
};

export default EmployeeListPage;
