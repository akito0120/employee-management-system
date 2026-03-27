import {
  CheckOutlined,
  EditOutlined,
  LeftOutlined,
  PictureOutlined,
  UpOutlined
} from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import { trpc } from '@renderer/trpc';
import {
  Alert,
  Breadcrumb,
  Button,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  Select,
  Typography
} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { JSX, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FindEmployeeByIdResponse } from 'src/shared/dto/employees/get-employee.dto';

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
};

const EmployeeDetails = ({ empl }: { empl: FindEmployeeByIdResponse }) => {
  const eligibleForPromotion = true;
  const eligibleForRaise = true;

  return (
    <>
      {eligibleForRaise ? (
        <Alert
          type="success"
          title="This employee is eligible for raise."
          description={`Next salary : €${2000}`}
          showIcon
          action={
            <Button variant="filled" color="default">
              Confirm Raise
            </Button>
          }
        />
      ) : (
        <Alert
          type="error"
          title="This employee is not eligible for raise yet."
          description={`Next raise is scheduled on ${new Date().toLocaleDateString()}`}
          showIcon
        />
      )}

      {eligibleForPromotion ? (
        <Alert
          type="success"
          title="This employee is eligible for promotion."
          description={`Next grade : G10`}
          showIcon
          action={
            <Button variant="filled" color="default">
              Confirm Promotion
            </Button>
          }
        />
      ) : (
        <Alert
          type="error"
          title="This employee is not eligible for promotion yet."
          description={`Next promotion is scheduled on ${new Date().toLocaleDateString()}`}
          showIcon
        />
      )}

      <Descriptions
        bordered
        column={2}
        items={[
          { label: 'First Name', children: empl.firstName },
          { label: 'Last Name', children: empl.lastName },
          { label: 'Birth Date', children: empl.birthDate.toLocaleDateString() },
          { label: 'Employee Code', children: empl.code },
          { label: 'Status', children: <EmployeeStatusTag status={empl.status} /> },
          {
            label: 'Affiliation',
            children: `${empl.affiliation?.name} ${empl.isManager ? '(Manager)' : ''}`
          },
          {
            label: 'Position',
            children: `${empl.position.name} (G${empl.position.grade})`
          },
          { label: 'Base Salary', children: empl.baseSalary },
          { label: 'Last Promotion Date', children: empl.lastPromotionDate.toLocaleDateString() },
          { label: 'Last Raise Date', children: empl.lastRaiseDate.toLocaleDateString() }
        ]}
      />

      <Descriptions
        bordered
        column={2}
        items={[
          { label: 'Email', children: empl.email },
          { label: 'Phone Number', children: empl.phoneNumber },
          { label: 'Country', children: empl.country },
          { label: 'State', children: empl.state },
          { label: 'City', children: empl.city },
          { label: 'Line 1', children: empl.line1 },
          { label: 'Line 2', children: empl.line2 },
          { label: 'Postal Code', children: empl.postalCode }
        ]}
      />

      <Descriptions
        bordered
        items={[
          {
            label: 'Remarks',
            children: <p style={{ width: '30rem', margin: 0 }}>{empl.remarks}</p>
          }
        ]}
      />
    </>
  );
};

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
  );
};

const EmployeeDetailPage = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<boolean>(false);

  const params = useParams();
  const id = Number(params.id);
  const { data: empl } = trpc.employees.findEmployeeById.useQuery(id);

  if (!empl) return null;

  return (
    <Flex gap="large" vertical style={{ padding: '2rem', height: '100%' }}>
      <Breadcrumb
        items={[{ title: 'Employees' }, { title: `${empl.firstName} ${empl.lastName}` }]}
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
          <EmployeeDetails
            empl={{
              ...empl,
              birthDate: new Date(empl.birthDate || ''),
              lastPromotionDate: new Date(empl.lastPromotionDate || ''),
              lastRaiseDate: new Date(empl.lastRaiseDate || '')
            }}
          />

          <Flex justify="center" gap="middle">
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigate('/employees')}
              variant="filled"
              color="default"
            >
              Back
            </Button>

            <Button icon={<EditOutlined />} variant="filled" color="primary">
              Edit
            </Button>

            <Button
              icon={<UpOutlined />}
              variant="filled"
              color="primary"
              onClick={() => navigate('promotion')}
              disabled={empl.status !== 'ACTIVE'}
            >
              Promote
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default EmployeeDetailPage;
