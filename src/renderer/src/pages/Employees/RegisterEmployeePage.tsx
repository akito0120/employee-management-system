import { CheckOutlined, LeftOutlined, PictureOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Dragger from 'antd/es/upload/Dragger'
import { useNavigate } from 'react-router-dom'
import { JSX } from 'react/jsx-runtime'

const RegisterEmployeeForm = (): JSX.Element => {
  return (
    <Form variant="filled">
      <Descriptions
        bordered
        column={2}
        items={[
          {
            label: 'First Name',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Last Name',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Employee Code',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Email',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Phone Number',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Address',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Zip Code',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Birth Date',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: 'Status',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Select style={{ width: '100%' }} placeholder="Status" />
              </Form.Item>
            )
          },
          {
            label: 'Position',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Select style={{ width: '100%' }} placeholder="Position" />
              </Form.Item>
            )
          },
          {
            label: 'Start Date',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Select style={{ width: '100%' }} placeholder="Status" />
              </Form.Item>
            )
          },
          {
            label: 'Base Monthly Salary',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <InputNumber style={{ width: '100%' }} prefix="€" />
              </Form.Item>
            )
          },
          {
            label: 'Remarks',
            span: 'filled',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <TextArea autoSize={{ minRows: 5 }} />
              </Form.Item>
            )
          }
        ]}
      />
    </Form>
  )
}

const RegisterEmployeePage = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Flex gap="large" vertical style={{ width: '100%', height: '100%', padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Employees' }, { title: 'Register' }]} />

      <Dragger
        style={{ width: '100%' }}
        multiple={false}
        accept=".csv,.xlsx"
        showUploadList={false}
      >
        <PictureOutlined style={{ fontSize: '3rem', paddingBottom: '1rem' }} />
        <Typography.Paragraph type="secondary">
          Click or drag file to this area to upload
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary">Supported format: .png, .jpeg</Typography.Paragraph>
      </Dragger>

      <RegisterEmployeeForm />

      <Flex style={{ width: '100%' }} justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate('/employees')}
          variant="filled"
          color="default"
        >
          Cancel
        </Button>
        <Button icon={<CheckOutlined />} variant="filled" color="primary">
          Register
        </Button>
      </Flex>
    </Flex>
  )
}

export default RegisterEmployeePage
