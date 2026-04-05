import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import { StyledButton } from '@renderer/components/Buttons';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Select, Table } from 'antd';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FindPositionRequest,
  FindPositionResponse
} from 'src/shared/dto/positions/find-position.dto';

const findPositionSearchParamsAtom = atom<FindPositionRequest>({
  page: 1,
  code: null,
  name: null,
  grades: null
});

const useFindPositionSearchParams = () => {
  return useAtom(findPositionSearchParamsAtom);
};

const PositionListSearchForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FindPositionRequest>();
  const [params, setParams] = useFindPositionSearchParams();

  const search = async () => {
    const values = await form.validateFields();
    setParams({ ...values, page: 1 });
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindPositionRequest> name="name" initialValue={params.name ?? undefined}>
        <Input placeholder={t('positions.field.name')} allowClear />
      </Form.Item>

      <Form.Item<FindPositionRequest> name="code" initialValue={params.code ?? undefined}>
        <Input placeholder={t('positions.field.code')} allowClear />
      </Form.Item>

      <Form.Item<FindPositionRequest> name="grades" initialValue={params.grades ?? undefined}>
        <Select
          placeholder={t('positions.field.grade')}
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => ({
            label: `G${grade}`,
            value: grade
          }))}
          style={{ minWidth: '7rem' }}
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
          allowClear
        />
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
  const navigate = useNavigate();

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      rowKey={(row) => row.id}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />,
        showSizeChanger: false
      }}
      columns={[
        { title: t('positions.field.name'), dataIndex: 'name' },
        { title: t('positions.field.code'), dataIndex: 'code' },
        {
          title: t('positions.field.grade'),
          dataIndex: 'grade',
          render: (grade: FindPositionResponse['items'][number]['grade']) => `G${grade}`
        },
        {
          render: (_, record) => (
            <Button icon={<RightOutlined />} type="text" onClick={() => navigate(`${record.id}`)} />
          )
        }
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
          <StyledButton
            icon={<PlusOutlined />}
            onClick={() => navigate('/positions/register')}
            variant="filled"
            color="primary"
          >
            {t('global.add')}
          </StyledButton>
        </AdminGuard>
      </Flex>

      <PositionListTable />
    </Flex>
  );
};

export default PositionListPage;
