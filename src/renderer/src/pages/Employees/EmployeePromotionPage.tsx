import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import {
  Alert,
  Breadcrumb,
  Button,
  Descriptions,
  Flex,
  Form,
  InputNumber,
  Progress,
  Select,
  Typography
} from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSalaryRangeRequest } from 'src/shared/dto/positions/get-salary-range.dto';

type FormType = {
  positionId: number;
  jobGradeLevel: GetSalaryRangeRequest['jobGradeLevel'];
  baseSalary: number;
};

const EmployeePromotionPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);
  const { data: empl } = trpc.employees.findEmployeeById.useQuery(id);
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery();
  const [form] = Form.useForm<FormType>();
  const positionId = Form.useWatch<number>('positionId', form);
  const jobGradeLevel = Form.useWatch<FormType['jobGradeLevel']>('jobGradeLevel', form);
  const { data: jobGradeOptions } = trpc.positions.getJobGradeLevelOptions.useQuery({ positionId });
  const { data: salaryRange } = trpc.positions.getSalaryRange.useQuery({
    positionId,
    jobGradeLevel
  });

  const submit = async () => {
    const _values = await form.validateFields();
  };

  const eligible = useMemo(() => {
    if (empl?.position?.progress === undefined) return false;
    return empl?.position?.progress >= 100;
  }, [empl?.position?.progress]);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb
        items={[
          { title: 'Employees' },
          { title: `${empl?.firstName} ${empl?.lastName}` },
          { title: 'Promotion' }
        ]}
      />

      <Descriptions
        bordered
        column={2}
        items={[
          { label: 'Name', children: `${empl?.firstName} ${empl?.lastName}` },
          { label: 'Code', children: empl?.code },
          {
            label: 'Current Position',
            children: `${empl?.position?.name} - ${empl?.position?.jobGradeLevel}`
          },
          { label: 'Current Base Salary', children: `€${empl?.baseSalary}` },
          {
            label: 'Last Promotion Date',
            children: new Date(empl?.lastPromotionDate || '').toLocaleDateString()
          },
          {
            label: 'Latest Performance Evaluation Score',
            children: 'B'
          },
          {
            label: 'Time In Role Progress',
            children: <Progress percent={Number(empl?.position?.progress.toFixed(1))} />
          }
        ]}
      />

      {eligible ? (
        <Alert
          title="Eligibility"
          description="This employee is eligible for promotion."
          type="success"
          showIcon
        />
      ) : (
        <Alert
          title="Eligibility"
          description="This employee is not eligible for promotion."
          type="warning"
          showIcon
        />
      )}

      <Form variant="filled" form={form} disabled={!eligible}>
        <Descriptions
          bordered
          column={1}
          items={[
            {
              label: 'Next Position',
              children: (
                <Flex gap="middle">
                  <Form.Item<FormType>
                    noStyle
                    name="positionId"
                    initialValue={empl?.position?.id}
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={positionOptions}
                      placeholder="Position"
                      style={{ width: '15rem' }}
                    />
                  </Form.Item>

                  <Form.Item<FormType> noStyle name="jobGradeLevel" rules={[{ required: true }]}>
                    <Select
                      placeholder="Job Grade"
                      style={{ width: '15rem' }}
                      options={jobGradeOptions}
                    />
                  </Form.Item>
                </Flex>
              )
            },
            {
              label: 'Next Base Salary',
              children: (
                <Flex gap="middle" align="center">
                  <Form.Item<FormType> name="baseSalary" noStyle rules={[{ required: true }]}>
                    <InputNumber
                      style={{ width: '20rem' }}
                      prefix="€"
                      min={salaryRange?.min}
                      max={salaryRange?.max}
                    />
                  </Form.Item>

                  {salaryRange && (
                    <Typography.Text>
                      Salary Range: €{salaryRange.min} - {salaryRange.max}
                    </Typography.Text>
                  )}
                </Flex>
              )
            }
          ]}
        />
      </Form>

      <Flex style={{ width: '100&' }} justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          variant="filled"
          color="default"
          onClick={() => navigate(`/employees/${empl?.id}`)}
        >
          Cancel
        </Button>
        <Button
          icon={<CheckOutlined />}
          variant="filled"
          color="primary"
          onClick={submit}
          disabled={!eligible}
        >
          Confirm Promotion
        </Button>
      </Flex>
    </Flex>
  );
};

export default EmployeePromotionPage;
