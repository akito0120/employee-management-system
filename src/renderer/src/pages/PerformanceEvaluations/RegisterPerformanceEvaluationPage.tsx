import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import SelectEmployeeModal from '@renderer/components/SelectEmployeeModal';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Descriptions, Flex, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';
import { RegisterPerformanceEvaluationRequest } from 'src/shared/dto/performance-evaluations/register-performance-evaluation.dto';

type FormType = Omit<
  RegisterPerformanceEvaluationRequest,
  'evaluatorEmployeeId' | 'evaluatedEmployeeId'
>;

const RegisterPerformanceEvaluationPage = () => {
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
      <Breadcrumb items={[{ title: 'Performance Evaluations' }, { title: 'Register' }]} />

      <Form variant="filled" form={form}>
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: '* Evaluator Employee',
              children: (
                <SelectEmployeeModal
                  onSelect={(value) => setEvaluator(value)}
                  value={evaluator}
                  excludeIds={[...(evaluated ? [evaluated.id] : [])]}
                />
              )
            },
            {
              label: '* Evaluated Employee',
              children: (
                <SelectEmployeeModal
                  onSelect={(value) => setEvaluated(value)}
                  value={evaluated}
                  excludeIds={[...(evaluator ? [evaluator.id] : [])]}
                />
              )
            },
            {
              label: '* Title',
              children: (
                <Form.Item<FormType> noStyle name="title">
                  <Input />
                </Form.Item>
              )
            },
            {
              label: '* Score',
              children: (
                <Form.Item<FormType> noStyle name="score">
                  <Input />
                </Form.Item>
              )
            },
            {
              label: '* Description',
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
        <Button
          variant="filled"
          color="default"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>

        <Button
          variant="filled"
          color="primary"
          icon={<CheckOutlined />}
          onClick={submit}
          loading={registerPending}
        >
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterPerformanceEvaluationPage;
