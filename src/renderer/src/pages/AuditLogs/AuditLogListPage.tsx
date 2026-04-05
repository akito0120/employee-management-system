import { SearchOutlined } from '@ant-design/icons';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useActionTargetOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Col, Flex, Form, InputNumber, Row, Select, Table } from 'antd';
import { format } from 'date-fns';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { FindAuditLogRequest } from 'src/shared/dto/audit-logs/find-audit-log.dto';

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
        showSizeChanger: false
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
          <Row style={{ width: '70rem' }} gutter={20}>
            <Col span={12}>
              {t('auditLogs.field.oldValue')}
              <pre>
                <code>{row.oldValue}</code>
              </pre>
            </Col>

            <Col span={12}>
              {t('auditLogs.field.newValue')}
              <pre>
                <code>{row.newValue}</code>
              </pre>
            </Col>
          </Row>
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
