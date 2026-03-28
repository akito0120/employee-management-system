import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import {
  App,
  Breadcrumb,
  Button,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  Select
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { RegisterPositionRequest } from 'src/shared/dto/positions/register-positions.dto';

const RegisterPositionPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm<RegisterPositionRequest>();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.positions.registerPosition.useMutation({
      onSuccess: () => navigate(-1),
      onError: (error) => {
        console.log(error);
        message.error('Failed to register');
      }
    });

  const submit = async () => {
    const values = await form.validateFields();
    await register(values);
  };

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Positions' }, { title: 'Register' }]} />

      <Form form={form} variant="filled">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: '* Name',
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: '* Position Code',
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: '* Initial Salary',
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="initialSalary"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <InputNumber prefix="€" style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: '* Raise Amount',
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="raiseAmount"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <InputNumber prefix="€" style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: '* Grade',
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="grade"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => ({
                      label: `G${grade}`,
                      value: grade
                    }))}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              )
            },
            {
              label: 'Time In Role',
              children: (
                <Form.Item<RegisterPositionRequest> name="timeInRole" noStyle>
                  <InputNumber suffix="Months" style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: 'Description',
              span: 'filled',
              children: (
                <Form.Item<RegisterPositionRequest> name="description" noStyle>
                  <TextArea autoSize={{ minRows: 5 }} />
                </Form.Item>
              )
            }
          ]}
        />
      </Form>

      <Flex justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          variant="filled"
          color="default"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>

        <Button
          icon={<CheckOutlined />}
          variant="filled"
          color="primary"
          onClick={submit}
          loading={registerPending}
        >
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterPositionPage;
