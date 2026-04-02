import { ImportOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import { useFindEmployeeSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from 'src/shared/dto/employees/find-employee.dto';

import { EmployeeEligibilities } from './EmployeeEligibilities';
import ExportEmployeeModal from './ExportEmployeeModal';

const EmployeeListSearchForm = () => {
  const [form] = Form.useForm<Omit<FindEmployeeRequest, 'eligibilities'>>();
  const [params, setParams] = useFindEmployeeSearchParams();
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();
  const { data: unitOptions } = trpc.units.getUnitOptions.useQuery();
  const [eligibilities, setEligibilities] = useState<string[]>(
    JSON.parse(params.eligibilities ?? '[]')
  );

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('code', values.code);
    setParams('organizationId', values.organizationId);
    setParams('status', values.status);
    setParams('page', 1);
    setParams('eligibilities', JSON.stringify(eligibilities));
  };

  const employeeStatusOptions: { label: string; value: FindEmployeeRequest['status'] }[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_LEAVE', label: 'On Leave' },
    { value: 'SICK_LEAVE', label: 'Sick Leave' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'PARENTAL_LEAVE', label: 'Parental Leave' },
    { value: 'NOTICE_PERIOD', label: 'Notice Period' },
    { value: 'TERMINATED', label: 'Terminated' }
  ];

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindEmployeeRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder="Name" allowClear />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="code" initialValue={params.code ?? undefined}>
        <Input placeholder="Employee Code" allowClear />
      </Form.Item>

      <Form.Item<FindEmployeeRequest>
        name="organizationId"
        initialValue={params.organizationId ?? undefined}
      >
        <Select
          options={[
            { label: 'Departments', options: deptOptions },
            { label: 'Sub Departments', options: subDeptOptions },
            { label: 'Units', options: unitOptions }
          ]}
          placeholder="Affiliation"
          style={{ width: '10rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="status" initialValue={params.status ?? undefined}>
        <Select
          options={employeeStatusOptions}
          placeholder="Status"
          style={{ width: '7rem' }}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <Select
          placeholder="Eligibilities"
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

const EmployeeListTable = ({
  onSelectedChange
}: {
  onSelectedChange: (selected: React.Key[]) => void;
}) => {
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
      rowSelection={{ onChange: (selected) => onSelectedChange(selected) }}
      columns={[
        {
          title: 'Name',
          render: (_, record) => (
            <Typography.Text>
              {record.firstName} {record.lastName}
            </Typography.Text>
          )
        },
        {
          title: 'Employee Code',
          dataIndex: 'code',
          render: (code: string) => <Typography.Text copyable>{code}</Typography.Text>
        },
        {
          title: 'Affiliation',
          dataIndex: 'affiliation'
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (status: FindEmployeeResponse['items'][number]['status']) => (
            <EmployeeStatusTag status={status} />
          )
        },
        {
          title: 'Email',
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
        showTotal: (total) => <Typography.Text type="secondary">{total} Results</Typography.Text>
      }}
      rowKey={(row) => row.id}
      expandable={{
        expandedRowRender: (record) => <EmployeeEligibilities id={record.id} />
      }}
    />
  );
};

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Employees' }]} />

      <Flex justify="space-between" vertical gap="middle">
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/register')}
            variant="filled"
            color="primary"
          >
            Register
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={() => navigate('/employees/import')}
            variant="filled"
            color="primary"
          >
            Import
          </Button>
          <ExportEmployeeModal selectedIds={selectedIds} />
        </Space>

        <EmployeeListSearchForm />
      </Flex>

      <EmployeeListTable
        onSelectedChange={(selected) => setSelectedIds(selected.map((key) => Number(key)))}
      />
    </Flex>
  );
};

export default EmployeeListPage;
