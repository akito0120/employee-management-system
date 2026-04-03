import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import { useFindPositionSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindPositionRequest,
  FindPositionResponse
} from 'src/shared/dto/positions/find-position.dto';

const PositionListSearchForm = () => {
  const [form] = Form.useForm<FindPositionRequest>();
  const [params, setParams] = useFindPositionSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams('name', values.name);
    setParams('code', values.code);
    setParams('page', 1);
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindPositionRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder="Name" allowClear />
      </Form.Item>

      <Form.Item<FindPositionRequest> name="code" initialValue={params.code ?? undefined}>
        <Input placeholder="Code" allowClear />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
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
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams('page', page),
        showTotal: (total) => <Typography.Text type="secondary">{total} Results</Typography.Text>
      }}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code' },
        {
          title: 'Grade',
          dataIndex: 'grade',
          render: (grade: FindPositionResponse['items'][number]['grade']) => `G${grade}`
        },
        { render: () => <Button icon={<RightOutlined />} type="text" /> }
      ]}
    />
  );
};

const PositionListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.positions') }]} />

      <Flex justify="space-between">
        <PositionListSearchForm />

        <AdminGuard>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/positions/register')}
            variant="filled"
            color="primary"
          >
            {t('global.register')}
          </Button>
        </AdminGuard>
      </Flex>

      <PositionListTable />
    </Flex>
  );
};

export default PositionListPage;
