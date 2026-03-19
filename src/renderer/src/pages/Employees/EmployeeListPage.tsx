import {
  ClearOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
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

enum EmployeeStatus {
  Active = 'ACTIVE',
  OnLeave = 'ON_LEAVE',
  Suspended = 'SUSPENDED',
  Terminated = 'TERMINATED'
}

// const employeeStatusToLabel: Record<EmployeeStatus, string> = {
//   ACTIVE: 'Active',
//   ON_LEAVE: 'On Leave',
//   SUSPENDED: 'Suspended',
//   TERMINATED: 'Terminated'
// }

// const employeeStatusToColor: Record<EmployeeStatus, string> = {
//   ACTIVE: 'blue',
//   ON_LEAVE: 'green',
//   SUSPENDED: 'orange',
//   TERMINATED: 'default'
// }

type Employee = {
  firstName: string;
  lastName: string;
  email: string;
  status: EmployeeStatus;
  id: string;
  employeeCode: string;
};

const sampleData: Employee[] = Array.from({ length: 100 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  id: faker.string.uuid(),
  employeeCode: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
  status: faker.helpers.enumValue(EmployeeStatus)
}));

const EmployeeListSearchForm = (): JSX.Element => {
  return (
    <Form layout="inline">
      <Form.Item>
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item>
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item>
        <Select
          options={[
            { label: 'IT Dept.', value: '1' },
            { label: 'HR Dept.', value: '2' }
          ]}
          placeholder="Department"
        />
      </Form.Item>

      <Form.Item>
        <Select
          options={[
            { label: 'Active', value: EmployeeStatus.Active },
            { label: 'On Leave', value: EmployeeStatus.OnLeave },
            { label: 'Suspended', value: EmployeeStatus.Suspended },
            { label: 'Terminated', value: EmployeeStatus.Terminated }
          ]}
          placeholder="Status"
        />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} />
          <Button icon={<ClearOutlined />} />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

const EmployeeListTable = ({
  employees,
  onSelectedChange
}: {
  employees: Employee[];
  onSelectedChange: (selected: React.Key[]) => void;
}): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Table<Employee>
      rowSelection={{ onChange: (selected) => onSelectedChange(selected) }}
      bordered
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
          dataIndex: 'employeeCode',
          render: (employeeCode: string) => (
            <Typography.Text copyable>{employeeCode}</Typography.Text>
          )
        },
        {
          title: 'Email',
          dataIndex: 'email',
          render: (email: string) => <Typography.Text copyable>{email}</Typography.Text>
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (status: EmployeeStatus) => <EmployeeStatusTag status={status} />
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
      pagination={{ total: employees.length }}
      dataSource={employees}
      rowKey={(row) => row.id}
    />
  );
};

const ExportEmployeesModal = ({ selectedIds }: { selectedIds: string[] }): JSX.Element => {
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

const EmployeeListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Employees' }]} />

      <Flex justify="space-between">
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
        employees={sampleData}
        onSelectedChange={(selected) => setSelectedIds(selected.map((key) => key.toString()))}
      />
    </Flex>
  );
};

export default EmployeeListPage;
