import { CheckOutlined, LeftOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, DatePicker, Descriptions, Flex, Form, Select } from 'antd'
import Input from 'antd/es/input/Input'
import TextArea from 'antd/es/input/TextArea'
import { useNavigate } from 'react-router-dom'

import { JSX } from 'react/jsx-runtime'

const RegisterDepartmentPage = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Departments' }, { title: 'Register' }]} />

      <Form variant="filled">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: 'Name',
              span: 'filled',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Department Code',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <Input />
                </Form.Item>
              )
            },
            {
              label: 'Established Date',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: 'Manager',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <Select style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: 'Status',
              children: (
                <Form.Item style={{ margin: 0 }}>
                  <Select style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: 'Description',
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

      <Flex justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          variant="filled"
          color="default"
          onClick={() => navigate('/departments')}
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

export default RegisterDepartmentPage
