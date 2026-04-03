import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useFindCommendationSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindCommendationRequest,
  FindCommendationResponse
} from 'src/shared/dto/commendations/find-commendation.dto';

const CommendationListSearchForm = () => {
  const { t } = useTranslation();
  const categoryOptions: { label: string; value: FindCommendationRequest['category'] }[] = [
    { label: 'Commendation', value: 'COMMENDATION' },
    { label: 'Sanction', value: 'SANCTION' }
  ];

  const [form] = Form.useForm<FindCommendationRequest>();
  const [params, setParams] = useFindCommendationSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams('title', values.title);
    setParams('category', values.category);
    setParams('page', 1);
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindCommendationRequest> name="title" initialValue={params.title ?? undefined}>
        <Input placeholder={t('commendations.field.title')} allowClear />
      </Form.Item>

      <Form.Item<FindCommendationRequest>
        name="category"
        initialValue={params.category ?? undefined}
      >
        <Select
          options={categoryOptions}
          style={{ width: '10rem' }}
          allowClear
          placeholder={t('commendations.field.category')}
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const CommendationListTable = () => {
  const { t } = useTranslation();
  const [params, setParams] = useFindCommendationSearchParams();
  const { data } = trpc.commendations.findCommendation.useQuery(params);

  return (
    <Table
      bordered
      dataSource={data?.items}
      columns={[
        { title: t('commendations.field.title'), dataIndex: 'title' },
        {
          title: t('commendations.field.category'),
          dataIndex: 'category',
          render: (category: FindCommendationResponse['items'][number]['category']) => {
            if (category === 'COMMENDATION') return 'Commendation';
            else if (category === 'SANCTION') return 'Sanction';
            return null;
          }
        },
        {
          title: t('commendations.field.issuedDate'),
          dataIndex: 'issuedAt',
          render: (issuedAt: string) => new Date(issuedAt).toLocaleDateString()
        },
        { render: () => <Button icon={<RightOutlined />} variant="text" color="default" /> }
      ]}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams('page', page),
        showTotal: (total) => <TableTotalCount total={total} />
      }}
    />
  );
};

const CommendationListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.commendations') }]} />

      <Flex justify="space-between">
        <CommendationListSearchForm />

        <Button
          icon={<PlusOutlined />}
          onClick={() => navigate('/commendations/issue')}
          variant="filled"
          color="primary"
        >
          {t('global.issue')}
        </Button>
      </Flex>

      <CommendationListTable />
    </Flex>
  );
};

export default CommendationListPage;
