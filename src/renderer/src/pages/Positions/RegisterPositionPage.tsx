import { CheckOutlined, LeftOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import {
  App,
  Breadcrumb,
  Button,
  Collapse,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { RegisterPositionRequest } from 'src/shared/dto/positions/register-positions.dto';

const RegisterPositionPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm<RegisterPositionRequest>();
  const { data: jobGradeLevelOptions } = trpc.positions.getJobGradeLevelOptions.useQuery({
    positionId: null
  });
  const { mutateAsync: register, isPending: registerPending } =
    trpc.positions.registerPosition.useMutation({
      onSuccess: () => navigate('/positions'),
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
              label: 'Name',
              children: (
                <Form.Item<RegisterPositionRequest> name="name" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Position Code',
              children: (
                <Form.Item<RegisterPositionRequest> name="code" style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Description',
              span: 'filled',
              children: (
                <Form.Item<RegisterPositionRequest> name="description" style={{ margin: 0 }}>
                  <TextArea autoSize={{ minRows: 5 }} />
                </Form.Item>
              )
            }
          ]}
        />

        <Divider plain>Job Grades</Divider>

        <Form.List name="jobGrades">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Form.Item key={key}>
                  <Collapse
                    defaultActiveKey={0}
                    items={[
                      {
                        key: 0,
                        extra: (
                          <Button
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            variant="text"
                            color="default"
                            size="small"
                          />
                        ),
                        children: (
                          <Descriptions
                            column={2}
                            bordered
                            items={[
                              {
                                label: 'Level',
                                children: (
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'level']}
                                    validateTrigger={['onChange', 'onBlur']}
                                    noStyle
                                  >
                                    <Select
                                      style={{ width: '100%' }}
                                      options={jobGradeLevelOptions}
                                    />
                                  </Form.Item>
                                )
                              },
                              {
                                label: 'Salary Range',
                                children: (
                                  <Flex gap="middle">
                                    <Form.Item name={[name, 'minSalary']} noStyle>
                                      <InputNumber
                                        placeholder="Min"
                                        prefix="€"
                                        style={{ width: '100%' }}
                                      />
                                    </Form.Item>

                                    <Typography.Text>-</Typography.Text>

                                    <Form.Item name={[name, 'maxSalary']} noStyle>
                                      <InputNumber
                                        placeholder="Max"
                                        prefix="€"
                                        style={{ width: '100%' }}
                                      />
                                    </Form.Item>
                                  </Flex>
                                )
                              },
                              {
                                label: 'Time In Role',
                                children: (
                                  <Form.Item name={[name, 'timeInRole']} noStyle>
                                    <InputNumber suffix="months" style={{ width: '100%' }} />
                                  </Form.Item>
                                )
                              },
                              {
                                label: 'Headcount',
                                children: (
                                  <Form.Item name={[name, 'headcount']} noStyle>
                                    <InputNumber style={{ width: '100%' }} />
                                  </Form.Item>
                                )
                              },
                              {
                                label: 'Description',
                                children: (
                                  <Form.Item noStyle name={[name, 'description']}>
                                    <TextArea autoSize={{ minRows: 3 }} />
                                  </Form.Item>
                                )
                              }
                            ]}
                          />
                        )
                      }
                    ]}
                  />
                </Form.Item>
              ))}
              <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add Job Grade
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>

      <Flex justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          variant="filled"
          color="default"
          onClick={() => navigate('/positions')}
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
