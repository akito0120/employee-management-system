import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex, Table, Typography } from 'antd';
import { useState } from 'react';

const AuditLogListTable = () => {
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
        showTotal: (total) => <Typography.Text type="secondary">{total} Results</Typography.Text>
      }}
      columns={[
        {
          title: 'User Id',
          dataIndex: 'userId'
        },
        {
          title: 'Category',
          dataIndex: 'category'
        },
        {
          title: 'Target',
          dataIndex: 'target'
        },
        {
          title: 'Target Id',
          dataIndex: 'targetId'
        },
        {
          title: 'Performed At',
          dataIndex: 'performedAt',
          render: (value: Date) => value.toISOString()
        }
      ]}
      expandable={{
        expandedRowRender: (row) => (
          <Flex style={{ padding: 0, margin: 0 }} vertical>
            {row.oldValue && (
              <Typography.Paragraph>
                Old Value : <code>{row.oldValue}</code>
              </Typography.Paragraph>
            )}

            {row.newValue && (
              <Typography.Paragraph>
                New Value : <code>{row.newValue}</code>
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
  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Audit Logs' }]} />

      <Flex justify="space-between"></Flex>

      <AuditLogListTable />
    </Flex>
  );
};

export default AuditLogListPage;
