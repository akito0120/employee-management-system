import {
  ClearOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons';
import DepartmentStatusTag from '@renderer/components/DepartmentStatusTag';
import { useFindDepartmentSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { OrganizationalUnit, OrganizationalUnitStatus } from 'src/main/db/schema';
import { FindDepartmentRequest } from 'src/shared/dto/departments/find-department.dto';

const DepartmentListTable = ({
  departments,
  onSelectedChange
}: {
  departments?: OrganizationalUnit[];
  onSelectedChange: (selected: React.Key[]) => void;
}): JSX.Element => {
  return (
    <Table<OrganizationalUnit>
      rowKey={(row) => row.id}
      rowSelection={{ onChange: (selected) => onSelectedChange(selected) }}
      bordered
      dataSource={departments}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        {
          title: 'Department Code',
          dataIndex: 'code',
          render: (departmentCode: string) => (
            <Typography.Text copyable>{departmentCode}</Typography.Text>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (status: OrganizationalUnitStatus) => <DepartmentStatusTag status={status} />
        },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
    />
  );
};

const DepartmentListSearchForm = (): JSX.Element => {
  const [_, setParams] = useFindDepartmentSearchParams();
  const [form] = Form.useForm<FindDepartmentRequest>();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('departmentCode', values.departmentCode);
    setParams('status', values.status);
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindDepartmentRequest> name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item<FindDepartmentRequest> name="departmentCode">
        <Input placeholder="Department Code" />
      </Form.Item>

      <Form.Item<FindDepartmentRequest> name="status">
        <Select
          placeholder="Status"
          options={[
            { label: 'Avtive', value: 'ACTIVE' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Closed', value: 'CLOSED' }
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} onClick={() => search()} />
          <Button icon={<ClearOutlined />} onClick={() => form.resetFields()} />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

const DepartmentListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [params] = useFindDepartmentSearchParams();
  const { data: departments } = trpc.departments.findDepartment.useQuery(params);

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
