import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useFindPositionSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindPositionRequest,
  FindPositionResponse
} from 'src/shared/dto/positions/find-position.dto';

const PositionListSearchForm = () => {
  const { t } = useTranslation();
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
        <Input placeholder={t('positions.field.name')} allowClear />
      </Form.Item>

      <Form.Item<FindPositionRequest> name="code" initialValue={params.code ?? undefined}>
        <Input placeholder={t('positions.field.code')} allowClear />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const PositionListTable = () => {
  const { t } = useTranslation();
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
        showTotal: (total) => <TableTotalCount total={total} />
      }}
      columns={[
        { title: t('positions.field.name'), dataIndex: 'name' },
        { title: t('positions.field.code'), dataIndex: 'code' },
        {
          title: t('positions.field.grade'),
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
            {t('global.add')}
          </Button>
        </AdminGuard>
      </Flex>

      <PositionListTable />
    </Flex>
  );
};

export default PositionListPage;
