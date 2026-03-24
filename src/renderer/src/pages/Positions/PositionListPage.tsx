import { ClearOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { useFindPositionSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FindPositionRequest } from 'src/shared/dto/positions/find-position.dto';

const PositionListSearchForm = () => {
  const [form] = Form.useForm<FindPositionRequest>();
  const [_, setParams] = useFindPositionSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('code', values.code);
  };

  return (
    <Form layout="inline">
      <Form.Item<FindPositionRequest> name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item<FindPositionRequest> name="code">
        <Input placeholder="Code" />
      </Form.Item>

      <Form.Item>
        <Space.Compact>
          <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
          <Button icon={<ClearOutlined />} onClick={() => form.resetFields()} />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

const PositionListTable = () => {
  const [params, setParams] = useFindPositionSearchParams();
  const { data, isLoading } = trpc.positions.findPosition.useQuery(params);

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      rowKey={(row) => row.id}
      pagination={{ total: data?.total, pageSize: 10, onChange: (page) => setParams('page', page) }}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code' },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
    />
  );
};

const PositionListPage = () => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Positions' }]} />

      <Flex justify="space-between">
        <PositionListSearchForm />

        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/positions/register')}
            variant="filled"
            color="primary"
          >
            Register
          </Button>
        </Space>
      </Flex>

      <PositionListTable />
    </Flex>
  );
};

export default PositionListPage;
