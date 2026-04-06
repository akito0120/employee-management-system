import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import SelectEmployeeModal from '@renderer/components/SelectEmployeeModal';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex, Form, Input, Space, Table, Typography } from 'antd';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';
import {
  FindPerformanceEvaluationRequest,
  FindPerformanceEvaluationResponse
} from 'src/shared/dto/performance-evaluations/find-performance-evaluation.dto';

const findPerformanceEvaluationSearchParamsAtom = atom<FindPerformanceEvaluationRequest>({
  page: 1,
  evaluatedEmployeeId: null,
  evaluatorEmployeeId: null,
  title: null
});

const useFindPerformanceEvaluationSearchParams = () => {
  return useAtom(findPerformanceEvaluationSearchParamsAtom);
};

const PerformanceEvaluationListSearchForm = () => {
  const { t } = useTranslation();
  const [_, setParams] = useFindPerformanceEvaluationSearchParams();
  const [form] = Form.useForm<FindPerformanceEvaluationRequest>();
  const [evaluator, setEvaluator] = useState<FindEmployeeResponse['items'][number] | undefined>();
  const [evaluated, setEvaluated] = useState<FindEmployeeResponse['items'][number] | undefined>();

  const submit = async () => {
    const values = await form.validateFields();
    setParams({
      ...values,
      evaluatorEmployeeId: evaluator?.id,
      evaluatedEmployeeId: evaluated?.id,
      page: 1
    });
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item<FindPerformanceEvaluationRequest> name="title">
        <Input placeholder={t('performanceEvaluations.field.title')} />
      </Form.Item>

      <Form.Item>
        <SelectEmployeeModal
          placeholder={t('performanceEvaluations.field.evaluator')}
          onSelect={(value) => setEvaluator(value)}
          onClear={() => setEvaluator(undefined)}
          value={evaluator}
          variant="outlined"
        />
      </Form.Item>

      <Form.Item>
        <SelectEmployeeModal
          placeholder={t('performanceEvaluations.field.evaluated')}
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
  const { t } = useTranslation();
  const [params, setParams] = useFindPerformanceEvaluationSearchParams();
  const { data, isLoading } =
    trpc.performanceEvaluations.findPerformanceEvaluation.useQuery(params);
  const navigate = useNavigate();

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={data?.items}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: (page) => setParams((values) => ({ ...values, page })),
        showTotal: (total) => <TableTotalCount total={total} />,
        showSizeChanger: false,
        defaultCurrent: params.page
      }}
      columns={[
        { title: t('performanceEvaluations.field.title'), dataIndex: 'title' },
        {
          title: t('performanceEvaluations.field.evaluator'),
          dataIndex: 'evaluatorEmployee',
          render: (
            value: FindPerformanceEvaluationResponse['items'][number]['evaluatorEmployee']
          ) => (
            <Space>
              <Typography.Text>
                {value.firstName} {value.lastName} ({value.code})
              </Typography.Text>
              <Button
                icon={<RightOutlined />}
                variant="text"
                color="default"
                onClick={() => navigate(`/employees/${value.id}`)}
              />
            </Space>
          )
        },
        {
          title: t('performanceEvaluations.field.evaluated'),
          dataIndex: 'evaluatedEmployee',
          render: (
            value: FindPerformanceEvaluationResponse['items'][number]['evaluatedEmployee']
          ) => (
            <Space>
              <Typography.Text>
                {value.firstName} {value.lastName} ({value.code})
              </Typography.Text>
              <Button
                icon={<RightOutlined />}
                variant="text"
                color="default"
                onClick={() => navigate(`/employees/${value.id}`)}
              />
            </Space>
          )
        },
        {
          title: t('performanceEvaluations.field.date'),
          dataIndex: 'evaluatedAt',
          render: (date: FindPerformanceEvaluationResponse['items'][number]['evaluatedAt']) =>
            date.toLocaleDateString()
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

        <StyledButton
          variant="filled"
          color="primary"
          onClick={() => navigate('register')}
          icon={<PlusOutlined />}
        >
          {t('global.add')}
        </StyledButton>
      </Flex>

      <PerformanceEvaluationListTable />
    </Flex>
  );
};

export default PerformanceEvaluationListPage;
