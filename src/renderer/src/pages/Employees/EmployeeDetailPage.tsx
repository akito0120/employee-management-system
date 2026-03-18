import {
  CheckOutlined,
  EditOutlined,
  LeftOutlined,
  PictureOutlined,
  UpOutlined
} from '@ant-design/icons'
import { faker } from '@faker-js/faker'
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag'
import {
  Breadcrumb,
  Button,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  Select,
  Skeleton,
  Typography
} from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { JSX, useState } from 'react'
import { useNavigate } from 'react-router-dom'

enum EmployeeStatus {
  Active = 'ACTIVE',
  OnLeave = 'ON_LEAVE',
  Suspended = 'SUSPENDED',
  Terminated = 'TERMINATED'
}

const data = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  id: faker.string.uuid(),
  employeeCode: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
  status: faker.helpers.enumValue(EmployeeStatus),
  phoneNumber: faker.phone.number(),
  address: `${faker.location.buildingNumber()}, ${faker.location.street()} ${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}`,
  zipCode: faker.location.zipCode(),
  birthDate: faker.date.birthdate()
}

const EmployeeDetails = (): JSX.Element => {
  return (
    <Descriptions
      bordered
      column={2}
      items={[
        { label: 'First Name', children: data.firstName },
        { label: 'Last Name', children: data.lastName },
        { label: 'Employee Code', children: data.email },
        { label: 'Email', children: data.email },
        { label: 'Phone Number', children: data.phoneNumber },
        { label: 'Address', children: data.address },
        { label: 'Zip Code', children: data.zipCode },
        { label: 'Birth Date', children: data.birthDate.toLocaleDateString() },
        { label: 'Status', children: <EmployeeStatusTag status={data.status} /> },
        { label: 'Position', children: 'Security Engineer' },
        { label: 'Last Promotion Date', children: faker.date.past().toLocaleDateString() },
        { label: 'Base Monthly Salary', children: `€ 4000` }
      ]}
    />
  )
}

const EmployeeDetailsForm = (): JSX.Element => {
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
                <Input defaultValue={data.firstName} />
              </Form.Item>
            )
          },
          {
            label: 'Last Name',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input defaultValue={data.lastName} />
              </Form.Item>
            )
          },
          {
            label: 'Employee Code',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input defaultValue={data.employeeCode} />
              </Form.Item>
            )
          },
          {
            label: 'Email',
            children: (
              <Form.Item required style={{ margin: 0 }}>
                <Input defaultValue={data.email} />
              </Form.Item>
            )
          },
          {
            label: 'Phone Number',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <Input defaultValue={data.phoneNumber} />
              </Form.Item>
            )
          },
          {
            label: 'Address',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <Input defaultValue={data.address} />
              </Form.Item>
            )
          },
          {
            label: 'Zip Code',
            children: (
              <Form.Item style={{ margin: 0 }}>
                <Input defaultValue={data.zipCode} />
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
          { label: 'Position', children: 'Security Engineer' },
          { label: 'Last Promotion Date', children: faker.date.past().toLocaleDateString() },
          { label: 'Base Monthly Salary', children: `€ 4000` }
        ]}
      />
    </Form>
  )
}

const EmployeeDetailPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [editing, setEditing] = useState<boolean>(false)

  return (
    <Flex gap="large" vertical style={{ padding: '2rem', height: '100%' }}>
      <Breadcrumb
        items={[{ title: 'Employees' }, { title: `${data.firstName} ${data.lastName}` }]}
      />

      {editing ? (
        <>
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
            <Typography.Paragraph type="secondary">
              Supported format: .png, .jpeg
            </Typography.Paragraph>
          </Dragger>

          <EmployeeDetailsForm />

          <Flex justify="center" gap="middle">
            <Button
              icon={<LeftOutlined />}
              onClick={() => setEditing(false)}
              variant="filled"
              color="default"
            >
              Cancel
            </Button>

            <Button
              icon={<CheckOutlined />}
              onClick={() => setEditing(false)}
              variant="filled"
              color="primary"
            >
              Apply
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Skeleton.Image styles={{ content: { width: '12rem', height: '12rem' } }} />

          <EmployeeDetails />

          <Flex justify="center" gap="middle">
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigate('/employees')}
              variant="filled"
              color="default"
            >
              Back
            </Button>

            <Button
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
              variant="filled"
              color="primary"
            >
              Edit
            </Button>

            <Button icon={<UpOutlined />} variant="filled" color="primary">
              Promote
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default EmployeeDetailPage
