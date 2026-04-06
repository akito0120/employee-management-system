import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useCommedationCategoryOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table } from 'antd';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindCommendationRequest,
  FindCommendationResponse
} from 'src/shared/dto/commendations/find-commendation.dto';

const findCommendationSearchParamsAtom = atom<FindCommendationRequest>({
  page: 1,
  category: null,
  title: null
});

const useFindCommendationSearchParams = () => {
  return useAtom(findCommendationSearchParamsAtom);
};

const CommendationListSearchForm = () => {
  const { t } = useTranslation();
  const categoryOptions = useCommedationCategoryOptions();

  const [form] = Form.useForm<FindCommendationRequest>();
  const [params, setParams] = useFindCommendationSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams({ ...values, page: 1 });
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
  const navigate = useNavigate();

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
            if (category === 'COMMENDATION') return t('enums.commendationCategory.commendation');
            else if (category === 'SANCTION') return t('enums.commendationCategory.sanction');
            return null;
          }
        },
        {
          title: t('commendations.field.issuedDate'),
          dataIndex: 'issuedAt',
          render: (issuedAt: string) => new Date(issuedAt).toLocaleDateString()
        },
        {
          render: (_, { id }) => (
            <Button
              icon={<RightOutlined />}
              variant="text"
              color="default"
              onClick={() => navigate(`${id}`)}
            />
          )
        }
      ]}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />,
        showSizeChanger: false,
        defaultCurrent: params.page
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

        <StyledButton
          icon={<PlusOutlined />}
          onClick={() => navigate('/commendations/issue')}
          variant="filled"
          color="primary"
        >
          {t('global.issue')}
        </StyledButton>
      </Flex>

      <CommendationListTable />
    </Flex>
  );
};

export default CommendationListPage;
