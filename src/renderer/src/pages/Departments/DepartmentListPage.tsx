import {
  ClearOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import DepartmentStatusTag from '@renderer/components/DepartmentStatusTag';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

enum DepartmentStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Closed = 'CLOSED'
}

type Department = {
  name: string;
  id: string;
  departmentCode: string;
  establishedDate: Date;
  status: DepartmentStatus;
};

const DepartmentListTable = ({
  departments,
  onSelectedChange
}: {
  departments: Department[];
  onSelectedChange: (selected: React.Key[]) => void;
}): JSX.Element => {
  return (
    <Table<Department>
      rowKey={(row) => row.id}
      rowSelection={{ onChange: (selected) => onSelectedChange(selected) }}
      bordered
      dataSource={departments}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        {
          title: 'Department Code',
          dataIndex: 'departmentCode',
          render: (departmentCode: string) => (
            <Typography.Text copyable>{departmentCode}</Typography.Text>
          )
        },
        {
          title: 'Established Date',
          dataIndex: 'establishedDate',
          render: (date: Date) => date.toLocaleDateString()
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (status: DepartmentStatus) => <DepartmentStatusTag status={status} />
        },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
    />
  );
};

const DepartmentListSearchForm = (): JSX.Element => {
  return (
    <Form layout="inline">
      <Form.Item>
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item>
        <Input placeholder="Department Code" />
      </Form.Item>

      <Form.Item>
        <Select placeholder="Status" />
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

const departments: Department[] = [
  {
    id: '1',
    name: 'IT Department',
    departmentCode: '111111',
    establishedDate: faker.date.past(),
    status: DepartmentStatus.Active
  },
  {
    id: '2',
    name: 'Sales Department',
    departmentCode: '222222',
    establishedDate: faker.date.past(),
    status: DepartmentStatus.Suspended
  },
  {
    id: '3',
    name: 'Cyber Security Department',
    departmentCode: '333333',
    establishedDate: faker.date.past(),
    status: DepartmentStatus.Closed
  }
];

const DepartmentListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Departments' }]} />

      <Flex justify="space-between">
        <DepartmentListSearchForm />

        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/departments/register')}
            variant="filled"
            color="primary"
          >
            Register
          </Button>

          <Button
            icon={<ImportOutlined />}
            onClick={() => navigate('/departments/import')}
            variant="filled"
            color="primary"
          >
            Import
          </Button>

          <Button
            icon={<ExportOutlined />}
            disabled={selectedIds.length === 0}
            variant="filled"
            color="primary"
          >
            Export
          </Button>
        </Space>
      </Flex>

      <DepartmentListTable
        departments={departments}
        onSelectedChange={(selected) => setSelectedIds(selected.map((key) => key.toString()))}
      />
    </Flex>
  );
};

export default DepartmentListPage;
