import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import SelectEmployeeModal from '@renderer/components/SelectEmployeeModal';
import { Breadcrumb, Button, Descriptions, Flex, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';

const RegisterPerformanceEvaluationPage = () => {
  const navigate = useNavigate();
  const [evaluator, setEvaluator] = useState<FindEmployeeResponse['items'][number] | undefined>();
  const [evaluated, setEvaluated] = useState<FindEmployeeResponse['items'][number] | undefined>();

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Performance Evaluations' }, { title: 'Register' }]} />

      <Form variant="filled">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: '* Evaluator Employee',
              children: (
                <SelectEmployeeModal onSelect={(value) => setEvaluator(value)} value={evaluator} />
              )
            },
            {
              label: '* Evaluated Employee',
              children: (
                <SelectEmployeeModal onSelect={(value) => setEvaluated(value)} value={evaluated} />
              )
            },
            {
              label: '* Title',
              children: (
                <Form.Item noStyle>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: '* Score',
              children: (
                <Form.Item noStyle>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: '* Description',
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
