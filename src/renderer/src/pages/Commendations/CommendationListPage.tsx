import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { useFindCommendationSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindCommendationRequest,
  FindCommendationResponse
} from 'src/shared/dto/commendations/find-commendation.dto';

const CommendationListSearchForm = () => {
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
        <Input placeholder="Title" allowClear />
      </Form.Item>

      <Form.Item<FindCommendationRequest>
        name="category"
        initialValue={params.category ?? undefined}
      >
        <Select
          options={categoryOptions}
          style={{ width: '10rem' }}
          allowClear
          placeholder="Category"
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={() => search()} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const CommendationListTable = () => {
  const [params, setParams] = useFindCommendationSearchParams();
  const { data } = trpc.commendations.findCommendation.useQuery(params);

  return (
    <Table
      bordered
      dataSource={data?.items}
      columns={[
        { title: 'Title', dataIndex: 'title' },
        {
          title: 'Category',
          dataIndex: 'category',
          render: (category: FindCommendationResponse['items'][number]['category']) => {
            if (category === 'COMMENDATION') return 'Commendation';
            else if (category === 'SANCTION') return 'Sanction';
            return null;
          }
        },
        {
          title: 'Issued Date',
          dataIndex: 'issuedAt',
          render: (issuedAt: string) => new Date(issuedAt).toLocaleDateString()
        },
        { render: () => <Button icon={<RightOutlined />} variant="text" color="default" /> }
      ]}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams('page', page),
        showTotal: (total) => <Typography.Text type="secondary">{total} Results</Typography.Text>
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
