import { RightOutlined, SearchOutlined } from '@ant-design/icons';
import SelectEmployeeModal from '@renderer/components/SelectEmployeeModal';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { useFindPerformanceEvaluationSearchParams } from '@renderer/hooks/search-params';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';
import {
  FindPerformanceEvaluationRequest,
  FindPerformanceEvaluationResponse
} from 'src/shared/dto/performance-evaluations/find-performance-evaluation.dto';

const PerformanceEvaluationListSearchForm = () => {
  const [_, setParams] = useFindPerformanceEvaluationSearchParams();
  const [form] = Form.useForm<FindPerformanceEvaluationRequest>();
  const [evaluator, setEvaluator] = useState<FindEmployeeResponse['items'][number] | undefined>();
  const [evaluated, setEvaluated] = useState<FindEmployeeResponse['items'][number] | undefined>();

  const submit = async () => {
    const values = await form.validateFields();
    setParams('page', 1);
    setParams('title', values.title);
    setParams('evaluatorEmployeeId', evaluator?.id);
    setParams('evaluatedEmployeeId', evaluated?.id);
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item<FindPerformanceEvaluationRequest> name="title">
        <Input placeholder="Title" />
      </Form.Item>

      <Form.Item>
        <SelectEmployeeModal
          placeholder="Evaluator"
          onSelect={(value) => setEvaluator(value)}
          onClear={() => setEvaluator(undefined)}
          value={evaluator}
          variant="outlined"
        />
      </Form.Item>

      <Form.Item>
        <SelectEmployeeModal
          placeholder="Evaluated"
          onSelect={(value) => setEvaluated(value)}
          onClear={() => setEvaluated(undefined)}
          value={evaluated}
          variant="outlined"
        />
      </Form.Item>

      <Form.Item>
        <Button icon={<SearchOutlined />} onClick={submit} htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

const PerformanceEvaluationListTable = () => {
  const [params, setParams] = useFindPerformanceEvaluationSearchParams();
  const { data, isLoading } =
    trpc.performanceEvaluations.findPerformanceEvaluation.useQuery(params);

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams('page', page),
        showTotal: (total) => <TableTotalCount total={total} />
      }}
      columns={[
        { title: 'Title', dataIndex: 'title' },
        {
          title: 'Evaluator',
          dataIndex: 'evaluatorEmployee',
          render: (
            value: FindPerformanceEvaluationResponse['items'][number]['evaluatorEmployee']
          ) => (
            <Space>
              <Typography.Text>
                {value.firstName} {value.lastName} ({value.code})
              </Typography.Text>
              <Button icon={<RightOutlined />} variant="text" color="default" />
            </Space>
          )
        },
        {
          title: 'Evaluated',
          dataIndex: 'evaluatedEmployee',
          render: (
            value: FindPerformanceEvaluationResponse['items'][number]['evaluatedEmployee']
          ) => (
            <Space>
              <Typography.Text>
                {value.firstName} {value.lastName} ({value.code})
              </Typography.Text>
              <Button icon={<RightOutlined />} variant="text" color="default" />
            </Space>
          )
        },
        {
          title: 'Date',
          dataIndex: 'evaluatedAt',
          render: (date: FindPerformanceEvaluationResponse['items'][number]['evaluatedAt']) =>
            date.toLocaleDateString()
        },
        { render: () => <Button icon={<RightOutlined />} variant="text" color="default" /> }
      ]}
    />
  );
};

const PerformanceEvaluationListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.performanceEvaluations') }]} />

      <Flex justify="space-between">
        <PerformanceEvaluationListSearchForm />

        <Button variant="filled" color="primary" onClick={() => navigate('register')}>
          {t('global.register')}
        </Button>
      </Flex>

      <PerformanceEvaluationListTable />
    </Flex>
  );
};

export default PerformanceEvaluationListPage;
