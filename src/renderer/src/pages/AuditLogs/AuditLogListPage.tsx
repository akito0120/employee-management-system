import TableTotalCount from '@renderer/components/TableTotalCount';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex, Table, Typography } from 'antd';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AuditLogListTable = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = trpc.auditLogs.findAuditLog.useQuery({ page });

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      pagination={{
        pageSize: 10,
        total: data?.total,
        onChange: (page) => setPage(page),
        showTotal: (total) => <TableTotalCount total={total} />
      }}
      columns={[
        {
          title: t('auditLogs.field.userId'),
          dataIndex: 'userId'
        },
        {
          title: t('auditLogs.field.category'),
          dataIndex: 'category'
        },
        {
          title: t('auditLogs.field.target'),
          dataIndex: 'target'
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
          <Flex style={{ padding: 0, margin: 0 }} vertical>
            {row.oldValue && (
              <Typography.Paragraph>
                {t('auditLogs.field.oldValue')} : <code>{row.oldValue}</code>
              </Typography.Paragraph>
            )}

            {row.newValue && (
              <Typography.Paragraph>
                {t('auditLogs.field.newValue')} : <code>{row.newValue}</code>
              </Typography.Paragraph>
            )}
          </Flex>
        )
      }}
      rowKey={(row) => row.id}
    />
  );
};

const AuditLogListPage = () => {
  const { t } = useTranslation();

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.auditLogs') }]} />
      <AuditLogListTable />
    </Flex>
  );
};

export default AuditLogListPage;
