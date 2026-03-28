import { ClearOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { useFindCommendationSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Space, Table, Typography } from 'antd';
import { JSX } from 'react/jsx-runtime';
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
  const [_, setParams] = useFindCommendationSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams('title', values.title);
    setParams('category', values.category);
    setParams('page', 1);
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindCommendationRequest> name="title">
        <Input placeholder="Title" />
      </Form.Item>

      <Form.Item<FindCommendationRequest> name="category">
        <Select
          options={categoryOptions}
          style={{ width: '10rem' }}
          allowClear
          placeholder="Category"
        />
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

const CommendationListPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Commendations and Sanctions' }]} />

      <Flex justify="space-between">
        <CommendationListSearchForm />

        <Button
          icon={<PlusOutlined />}
          onClick={() => navigate('/commendations/issue')}
          variant="filled"
          color="primary"
        >
          Issue
        </Button>
      </Flex>

      <CommendationListTable />
    </Flex>
  );
};

export default CommendationListPage;
