import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import {
  useAffiliationOptions,
  useCommedationCategoryOptions,
  useEmployeeStatusOptions
} from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import {
  App,
  Breadcrumb,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  Pagination,
  Select,
  Transfer,
  Typography
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IssueCommendationRequest } from 'src/shared/dto/commendations/issue-commendation.dto';
import {
  FindEmployeeRequest,
  FindEmployeeResponse
} from 'src/shared/dto/employees/find-employee.dto';

const RegisterCommendationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm<IssueCommendationRequest>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [statuses, setStatuses] = useState<FindEmployeeRequest['statuses']>([]);
  const [affiliationIds, setAffiliationIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const [targetItems, setTargetItems] = useState<FindEmployeeResponse['items']>([]);
  const targetKeys = useMemo(() => targetItems.map((item) => item.id), [targetItems]);

  const { data, refetch } = trpc.employees.findEmployee.useQuery({
    page,
    name: searchValue,
    code: null,
    organizationIds: affiliationIds,
    statuses,
    excludeIds: targetKeys
  });

  const { mutateAsync: issue, isPending: issuePending } =
    trpc.commendations.issueCommendation.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error('Failed to issue')
    });

  const combinedDataSource = useMemo(() => {
    const map = new Map();
    targetItems.forEach((item) => map.set(item.id, { ...item, key: item.id }));
    data?.items.map((item) => map.set(item.id, { ...item, key: item.id }));
    return Array.from(map.values());
  }, [targetItems, data?.items]);

  const onChange = (nextTargetKeys) => {
    const newTargetItems = combinedDataSource.filter((item) => nextTargetKeys.includes(item.key));
    setTargetItems(newTargetItems);
    refetch();
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (targetKeys.length === 0) return;
    await issue({ ...values, employeeIds: targetKeys });
  };

  const categoryOptions = useCommedationCategoryOptions();
  const affiliationOptions = useAffiliationOptions();
  const employeeStatusOptions = useEmployeeStatusOptions();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.commendations') }, { title: t('global.issue') }]} />

      <Form variant="outlined" form={form}>
        <Descriptions
          column={2}
          bordered
          items={[
            {
              label: `* ${t('commendations.field.title')}`,
              span: 'filled',
              children: (
                <Form.Item<IssueCommendationRequest>
                  noStyle
                  rules={[{ required: true }]}
                  name="title"
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('commendations.field.category')}`,
              children: (
                <Form.Item<IssueCommendationRequest>
                  noStyle
                  rules={[{ required: true }]}
                  name="category"
                >
                  <Select style={{ width: '100%', minWidth: '15rem' }} options={categoryOptions} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('commendations.field.adjustment')}`,
              children: (
                <Form.Item<IssueCommendationRequest>
                  noStyle
                  rules={[{ required: true }]}
                  name="adjustment"
                >
                  <InputNumber style={{ width: '100%' }} suffix={t('global.months')} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('commendations.field.description')}`,
              span: 'filled',
              children: (
                <Form.Item<IssueCommendationRequest>
                  noStyle
                  rules={[{ required: true }]}
                  name="description"
                >
                  <TextArea autoSize={{ minRows: 5 }} />
                </Form.Item>
              )
            }
          ]}
        />
      </Form>

      <Typography.Text style={{ marginTop: '1rem' }} type="secondary">
        * {t('commendations.issue.employeesLabel')}
      </Typography.Text>

      <Flex gap="middle">
        <Input
          style={{ width: '20rem' }}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          placeholder={`${t('employees.field.name')}`}
        />

        <Select
          allowClear
          placeholder={t('employees.field.affiliation')}
          options={affiliationOptions}
          onChange={(ids: number[]) => setAffiliationIds(ids)}
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
          style={{ minWidth: '10rem' }}
          styles={{ popup: { root: { width: '20rem' } } }}
        />

        <Select
          allowClear
          placeholder={t('employees.field.status')}
          options={employeeStatusOptions}
          onChange={(statuses) => setStatuses(statuses)}
          mode="multiple"
          maxTagCount={1}
          maxTagTextLength={5}
          style={{ minWidth: '7rem' }}
          styles={{ popup: { root: { width: '10rem' } } }}
        />
      </Flex>

      <Transfer
        dataSource={combinedDataSource}
        targetKeys={targetKeys}
        onChange={onChange}
        showSearch={false}
        showSelectAll={false}
        styles={{ root: { width: '100%' }, section: { width: '100%', height: '30rem' } }}
        render={(item: FindEmployeeResponse['items'][number]) => (
          <Flex gap="middle" style={{ padding: '0.5rem' }}>
            <Typography.Text ellipsis style={{ maxWidth: '20rem' }}>
              {item.firstName} {item.lastName} ({item.code}) - {item.affiliation}
            </Typography.Text>
            <EmployeeStatusTag status={item.status} />
          </Flex>
        )}
      />

      <Pagination onChange={(page) => setPage(page)} total={data?.total} simple size="small" />

      <Flex style={{ width: '100%' }} gap="middle" justify="center">
        <StyledButton
          variant="filled"
          color="default"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
        >
          {t('global.cancel')}
        </StyledButton>

        <StyledButton
          variant="filled"
          color="primary"
          icon={<CheckOutlined />}
          onClick={submit}
          loading={issuePending}
        >
          {t('global.confirm')}
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export default RegisterCommendationPage;
