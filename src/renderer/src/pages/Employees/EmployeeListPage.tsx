import { ImportOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useAffiliationOptions, useEmployeeStatusOptions } from '@renderer/hooks/options';
import { useFindEmployeeSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from 'src/shared/dto/employees/find-employee.dto';

import ExportEmployeeModal from './ExportEmployeeModal';

const EmployeeListSearchForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Omit<FindEmployeeRequest, 'eligibilities'>>();
  const [params, setParams] = useFindEmployeeSearchParams();
  const [eligibilities, setEligibilities] = useState<string[]>(
    JSON.parse(params.eligibilities ?? '[]')
  );
  const affiliationOptions = useAffiliationOptions();
  const employeeStatusOptions = useEmployeeStatusOptions();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('code', values.code);
    setParams('organizationId', values.organizationId);
    setParams('status', values.status);
    setParams('page', 1);
    setParams('eligibilities', JSON.stringify(eligibilities));
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
        name="organizationId"
        initialValue={params.organizationId ?? undefined}
      >
        <Select
          options={affiliationOptions}
          placeholder={t('employees.field.affiliation')}
          style={{ width: '10rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="status" initialValue={params.status ?? undefined}>
        <Select
          options={employeeStatusOptions}
          placeholder={t('employees.field.status')}
          style={{ width: '7rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <Select
          placeholder={t('employees.searchForm.eligibilitiesPlaceholder')}
          style={{ minWidth: '10rem' }}
          mode="multiple"
          options={[
            { label: 'Raise', value: 'ELIGIBLE_FOR_RAISE' },
            { label: 'Promotion', value: 'ELIGIBLE_FOR_PROMOTION' }
          ]}
          onChange={(value) => setEligibilities(value)}
          value={eligibilities}
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
  const { data, isLoading } = trpc.employees.findEmployee.useQuery({
    ...params,
    eligibilities: JSON.parse(params.eligibilities ?? 'null')
  });

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
          render: (code: string) => <Typography.Text copyable>{code}</Typography.Text>
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
        onChange: (page) => setParams('page', page),
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
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/register')}
            variant="filled"
            color="primary"
          >
            {t('global.register')}
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={() => navigate('/employees/import')}
            variant="filled"
            color="primary"
          >
            {t('global.import')}
          </Button>
          <ExportEmployeeModal />
        </Space>

        <EmployeeListSearchForm />
      </Flex>

      <EmployeeListTable />
    </Flex>
  );
};

export default EmployeeListPage;
