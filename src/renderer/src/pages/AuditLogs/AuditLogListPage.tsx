import { SearchOutlined } from '@ant-design/icons';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useActionTargetOptions } from '@renderer/hooks/options';
import { themeAtom } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, InputNumber, Select, Table } from 'antd';
import { format } from 'date-fns';
import { atom, useAtom, useAtomValue } from 'jotai';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useTranslation } from 'react-i18next';
import { FindAuditLogRequest } from 'src/shared/dto/audit-logs/find-audit-log.dto';

import AuditLogActionCategoryLabel from './AuditLogActionCategoryLabel';
import AuditLogActionTargetLabel from './AuditLogActionTargetLabel';

const findAuditLogSearchParams = atom<FindAuditLogRequest>({
  page: 1,
  targets: null,
  targetId: null
});

const useFindAuditLogSearchParams = () => {
  return useAtom(findAuditLogSearchParams);
};

const AuditLogListTable = () => {
  const { t } = useTranslation();
  const [params, setParams] = useFindAuditLogSearchParams();
  const { data, isLoading } = trpc.auditLogs.findAuditLog.useQuery(params);
  const theme = useAtomValue(themeAtom);

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      pagination={{
        pageSize: 10,
        total: data?.total,
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />,
        showSizeChanger: false,
        defaultCurrent: params.page
      }}
      columns={[
        {
          title: 'User Name',
          dataIndex: 'performedBy'
        },
        {
          title: t('auditLogs.field.category'),
          dataIndex: 'category',
          render: (category) => <AuditLogActionCategoryLabel category={category} />
        },
        {
          title: t('auditLogs.field.target'),
          dataIndex: 'target',
          render: (target) => <AuditLogActionTargetLabel target={target} />
        },
        {
          title: t('auditLogs.field.targetId'),
          dataIndex: 'targetId'
        },
        {
          title: t('auditLogs.field.performedAt'),
          dataIndex: 'performedAt',
          render: (value: string) => format(new Date(value), 'yyyy/MM/dd hh:mm:ss')
        }
      ]}
      expandable={{
        expandedRowRender: (row) => (
          <ReactDiffViewer
            oldValue={row.oldValue ?? undefined}
            newValue={row.newValue ?? undefined}
            splitView={true}
            compareMethod={DiffMethod.WORDS}
            styles={{ contentText: { fontFamily: 'IBMPlexSansJP' } }}
            useDarkTheme={theme === 'dark'}
          />
        )
      }}
      rowKey={(row) => row.id}
    />
  );
};

const AuditLogListSearchForm = () => {
  const [form] = Form.useForm<FindAuditLogRequest>();
  const [params, setParams] = useFindAuditLogSearchParams();
  const { t } = useTranslation();
  const targetOptions = useActionTargetOptions();

  const search = async () => {
    const values = await form.validateFields();
    setParams({ ...values, page: 1 });
    console.log(params);
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item<FindAuditLogRequest> name="targets" initialValue={params.targets ?? undefined}>
        <Select
          mode="multiple"
          allowClear
          placeholder={t('auditLogs.field.target')}
          style={{ minWidth: '10rem' }}
          maxTagCount={1}
          maxTagTextLength={5}
          options={targetOptions}
        />
      </Form.Item>

      <Form.Item<FindAuditLogRequest> name="targetId" initialValue={params.targetId ?? undefined}>
        <InputNumber
          min={0}
          placeholder={t('auditLogs.field.targetId')}
          style={{ width: '10rem' }}
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={search} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const AuditLogListPage = () => {
  const { t } = useTranslation();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.auditLogs') }]} />
      <AuditLogListSearchForm />
      <AuditLogListTable />
    </Flex>
  );
};

export default AuditLogListPage;
