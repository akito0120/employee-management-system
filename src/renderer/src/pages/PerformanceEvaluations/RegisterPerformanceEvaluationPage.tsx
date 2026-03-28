import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Descriptions, Flex, Form, Input, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';

const RegisterPerformanceEvaluationPage = () => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Performance Evaluations' }, { title: 'Register' }]} />

      <Form variant="filled">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: 'Evaluator Employee',
              children: (
                <Button variant="filled" color="default" style={{ width: '100%' }}>
                  <Typography.Text type="secondary">Select</Typography.Text>
                </Button>
              )
            },
            {
              label: 'Evaluated Employee',
              children: (
                <Button variant="filled" color="default" style={{ width: '100%' }}>
                  <Typography.Text type="secondary">Select</Typography.Text>
                </Button>
              )
            },
            {
              label: 'Title',
              children: (
                <Form.Item noStyle>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Score',
              children: (
                <Form.Item noStyle>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Description',
              children: (
                <Form.Item noStyle>
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
        <Button variant="filled" color="primary" icon={<CheckOutlined />}>
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default RegisterPerformanceEvaluationPage;
