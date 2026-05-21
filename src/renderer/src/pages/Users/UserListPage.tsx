import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import ButtonWithConfirm from '@renderer/components/ButtonWithConfirm';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Button, Checkbox, Flex, Form, Input, Table } from 'antd';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FindUserRequest } from 'src/shared/dto/users/find-user.dto';

const findUserSearchParamsAtom = atom<FindUserRequest>({
  page: 1,
  name: null,
  isAdmin: null
});

const UserListTable = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [params, setParams] = useAtom(findUserSearchParamsAtom);
  const { data, isLoading, refetch } = trpc.users.findUser.useQuery(params);
  const { mutate: deleteUser, isPending: deletePending } = trpc.users.deleteUser.useMutation({
    onError: () => message.error(t('global.somethingWentWrongMsg')),
    onSuccess: () => refetch()
  });

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
        showSizeChanger: false,
        defaultCurrent: params.page
      }}
      columns={[
        { title: t('users.field.firstName'), dataIndex: 'firstName' },
        { title: t('users.field.lastName'), dataIndex: 'lastName' },
        { title: t('users.field.email'), dataIndex: 'email' },
        {
          title: t('users.field.isAdmin'),
          dataIndex: 'isAdmin',
          render: (value) => value.toString()
        },
        {
          dataIndex: 'id',
          render: (id: number) => (
            <ButtonWithConfirm
              icon={<DeleteOutlined />}
              loading={deletePending}
              onConfirm={() => {
                deleteUser(id);
              }}
              title={t('users.delete.confirmMsg')}
            />
          )
        }
      ]}
    />
  );
};

const UserListSearchForm = () => {
  const [params, setParams] = useAtom(findUserSearchParamsAtom);
  const [form] = Form.useForm<FindUserRequest>();
  const { t } = useTranslation();

  const search = async () => {
    const values = await form.validateFields();
    setParams({ ...params, name: values.name, isAdmin: values.isAdmin });
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item<FindUserRequest> initialValue={params.name ?? undefined} name="name">
        <Input placeholder={t('users.field.name')} />
      </Form.Item>

      <Form.Item<FindUserRequest>
        valuePropName="checked"
        initialValue={params.isAdmin ?? undefined}
        name="isAdmin"
      >
        <Checkbox>{t('users.field.isAdmin')}</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const UserListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.users') }]} />

      <Flex justify="space-between">
        <UserListSearchForm />

        <StyledButton
          onClick={() => navigate('create')}
          variant="filled"
          color="primary"
          icon={<PlusOutlined />}
        >
          {t('global.add')}
        </StyledButton>
      </Flex>

      <UserListTable />
    </Flex>
  );
};

export default UserListPage;
