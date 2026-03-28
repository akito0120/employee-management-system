import {
  ClearOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import { useFindEmployeeSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography
} from 'antd';
import React, { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from 'src/shared/dto/employees/find-employee.dto';

const EmployeeListSearchForm = () => {
  const [form] = Form.useForm<Omit<FindEmployeeRequest, 'eligibilities'>>();
  const [_, setParams] = useFindEmployeeSearchParams();
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();
  const { data: unitOptions } = trpc.units.getUnitOptions.useQuery();
  const [eligibilities, setEligibilities] = useState<string[]>([]);

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('code', values.code);
    setParams('organizationId', values.organizationId);
    setParams('status', values.status);
    setParams('page', 1);
    setParams('eligibilities', JSON.stringify(eligibilities));

    console.log(values);
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
      <Form.Item<FindEmployeeRequest> name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="code">
        <Input placeholder="Employee Code" />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="organizationId">
        <Select
          options={[
            { label: 'Departments', options: deptOptions },
            { label: 'Sub Departments', options: subDeptOptions },
            { label: 'Units', options: unitOptions }
          ]}
          placeholder="Affiliation"
          style={{ width: '10rem' }}
        />
      </Form.Item>

      <Form.Item<FindEmployeeRequest> name="status">
        <Select options={employeeStatusOptions} placeholder="Status" style={{ width: '7rem' }} />
      </Form.Item>

      <Form.Item>
        <Select
          style={{ minWidth: '10rem' }}
          mode="multiple"
          options={[
            { label: 'Raise', value: 'ELIGIBLE_FOR_RAISE' },
            { label: 'Promotion', value: 'ELIGIBLE_FOR_PROMOTION' }
          ]}
          onChange={(value) => setEligibilities(value)}
          value={eligibilities}
        />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              form.resetFields();
              setEligibilities([]);
            }}
          />
        </Space.Compact>
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
    />
  );
};

const ExportEmployeesModal = ({ selectedIds }: { selectedIds: number[] }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        icon={<ExportOutlined />}
        disabled={selectedIds.length === 0}
        onClick={() => setOpen(true)}
        variant="filled"
        color="primary"
      >
        Export
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        okText="Export"
        title="Export Employee Data"
        okButtonProps={{ variant: 'filled', color: 'primary' }}
        cancelButtonProps={{ variant: 'filled', color: 'default' }}
      >
        <Form layout="horizontal" style={{ padding: '1rem' }}>
          <Form.Item>
            <Typography.Text type="secondary">
              {selectedIds.length} records are selected
            </Typography.Text>
          </Form.Item>

          <Form.Item label="Format">
            <Select
              defaultValue="csv"
              options={[
                { label: 'CSV', value: 'csv' },
                { label: 'Excel', value: 'excel' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Employees' }]} />

      <Flex justify="space-between" vertical gap="middle">
        <EmployeeListSearchForm />

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
          <ExportEmployeesModal selectedIds={selectedIds} />
        </Space>
      </Flex>

      <EmployeeListTable
        onSelectedChange={(selected) => setSelectedIds(selected.map((key) => Number(key)))}
      />
    </Flex>
  );
};

export default EmployeeListPage;
