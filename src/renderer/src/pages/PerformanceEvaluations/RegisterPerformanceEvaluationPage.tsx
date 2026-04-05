import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import SelectEmployeeModal from '@renderer/components/SelectEmployeeModal';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Descriptions, Flex, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';
import { RegisterPerformanceEvaluationRequest } from 'src/shared/dto/performance-evaluations/register-performance-evaluation.dto';

type FormType = Omit<
  RegisterPerformanceEvaluationRequest,
  'evaluatorEmployeeId' | 'evaluatedEmployeeId'
>;

const RegisterPerformanceEvaluationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [evaluator, setEvaluator] = useState<FindEmployeeResponse['items'][number] | undefined>();
  const [evaluated, setEvaluated] = useState<FindEmployeeResponse['items'][number] | undefined>();

  const { mutateAsync: register, isPending: registerPending } =
    trpc.performanceEvaluations.registerPerformanceEvaluation.useMutation({
      onSuccess: () => navigate(-1)
    });
  const [form] = Form.useForm<FormType>();

  const submit = async () => {
    const values = await form.validateFields();
    if (!evaluator || !evaluated) return;
    if (evaluator === evaluated) return;

    await register({
      ...values,
      evaluatorEmployeeId: evaluator.id,
      evaluatedEmployeeId: evaluated.id
    });
  };

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb
        items={[{ title: t('global.performanceEvaluations') }, { title: t('global.add') }]}
      />

      <Form variant="outlined" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('performanceEvaluations.field.evaluator')}`,
              children: (
                <SelectEmployeeModal
                  onSelect={(value) => setEvaluator(value)}
                  onClear={() => setEvaluator(undefined)}
                  value={evaluator}
                  excludeIds={[...(evaluated ? [evaluated.id] : [])]}
                  variant="outlined"
                />
              )
            },
            {
              label: `* ${t('performanceEvaluations.field.evaluated')}`,
              children: (
                <SelectEmployeeModal
                  onSelect={(value) => setEvaluated(value)}
                  onClear={() => setEvaluated(undefined)}
                  value={evaluated}
                  excludeIds={[...(evaluator ? [evaluator.id] : [])]}
                  variant="outlined"
                />
              )
            },
            {
              label: `* ${t('performanceEvaluations.field.title')}`,
              children: (
                <Form.Item<FormType> noStyle name="title">
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('performanceEvaluations.field.score')}`,
              children: (
                <Form.Item<FormType> noStyle name="score">
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('performanceEvaluations.field.description')}`,
              children: (
                <Form.Item<FormType> noStyle name="description">
                  <TextArea autoSize={{ minRows: 20 }} />
                </Form.Item>
              )
            }
          ]}
        />
      </Form>

      <Flex gap="middle" justify="center">
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
          loading={registerPending}
        >
          {t('global.confirm')}
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export default RegisterPerformanceEvaluationPage;
