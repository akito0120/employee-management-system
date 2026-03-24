import { CheckOutlined, LeftOutlined, PictureOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
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
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Dragger from 'antd/es/upload/Dragger';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { RegisterEmployeeRequest } from 'src/shared/dto/employees/register-employee.dto';
import { GetSalaryRangeRequest } from 'src/shared/dto/positions/get-salary-range.dto';

const RegisterEmployeeForm = () => {
  const [form] = Form.useForm<RegisterEmployeeRequest>();
  const positionId = Form.useWatch<number | undefined>('positionId', form);
  const jobGradeLevel = Form.useWatch<GetSalaryRangeRequest['jobGradeLevel']>(
    'jobGradeLevel',
    form
  );
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery();
  const { data: jobGradeLevelOptions } = trpc.positions.getJobGradeLevelOptions.useQuery({
    positionId: positionId || null
  });
  const { data: salaryRange } = trpc.positions.getSalaryRange.useQuery({
    positionId,
    jobGradeLevel
  });

  const employeeStatusOptions: { label: string; value: RegisterEmployeeRequest['status'] }[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_LEAVE', label: 'On Leave' },
    { value: 'SICK_LEAVE', label: 'Sick Leave' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'PARENTAL_LEAVE', label: 'Parental Leave' },
    { value: 'NOTICE_PERIOD', label: 'Notice Period' },
    { value: 'TERMINATED', label: 'Terminated' }
  ];

  return (
    <Form variant="filled" form={form}>
      <Descriptions
        bordered
        column={2}
        items={[
          {
            label: 'First Name',
            children: (
              <Form.Item<RegisterEmployeeRequest> required noStyle name="firstName">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Last Name',
            children: (
              <Form.Item<RegisterEmployeeRequest> required noStyle name="lastName">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Birth Date',
            children: (
              <Form.Item<RegisterEmployeeRequest> required noStyle name="birthDate">
                <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: 'Employee Code',
            children: (
              <Form.Item<RegisterEmployeeRequest> required noStyle name="code">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Status',
            children: (
              <Form.Item<RegisterEmployeeRequest> required noStyle name="status">
                <Select
                  style={{ width: '100%' }}
                  placeholder="Status"
                  options={employeeStatusOptions}
                />
              </Form.Item>
            )
          },
          {
            label: 'Affiliation',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="organizationId">
                <Select style={{ width: '100%' }} options={[]} />
              </Form.Item>
            )
          },
          {
            label: 'Position',
            children: (
              <Flex gap="middle">
                <Form.Item<RegisterEmployeeRequest> required noStyle name="positionId">
                  <Select
                    style={{ width: '12rem' }}
                    placeholder="Position"
                    options={positionOptions}
                    allowClear
                  />
                </Form.Item>

                <Form.Item<RegisterEmployeeRequest> required noStyle name="jobGradeLevel">
                  <Select
                    style={{ width: '7rem' }}
                    placeholder="Job Grade"
                    options={jobGradeLevelOptions}
                    allowClear
                    disabled={positionId === undefined}
                  />
                </Form.Item>
              </Flex>
            )
          },
          {
            label: 'Base Salary',
            children: (
              <Flex gap="middle" align="center">
                <Form.Item<RegisterEmployeeRequest>
                  required
                  style={{ margin: 0 }}
                  name="baseSalary"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    prefix="€"
                    min={salaryRange?.min}
                    max={salaryRange?.max}
                  />
                </Form.Item>

                {salaryRange && (
                  <Typography.Text>
                    Salary Range: €{salaryRange.min} - {salaryRange.max}
                  </Typography.Text>
                )}
              </Flex>
            )
          }
        ]}
      />

      <Descriptions
        style={{ marginTop: '2rem' }}
        bordered
        column={2}
        items={[
          {
            label: 'Email',
            children: (
              <Form.Item<RegisterEmployeeRequest> required noStyle name="email">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Phone Number',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="phoneNumber">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Country',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="country">
                <Select style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: 'State',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="state">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'City',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="city">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Line 1',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="line1">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Line 2',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="line2">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Postal Code',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="postalCode">
                <Input />
              </Form.Item>
            )
          }
        ]}
      />

      <Descriptions
        style={{ marginTop: '2rem' }}
        bordered
        items={[
          {
            label: 'Remarks',
            span: 'filled',
            children: (
              <Form.Item<RegisterEmployeeRequest> noStyle name="remarks">
                <TextArea autoSize={{ minRows: 5 }} />
              </Form.Item>
            )
          }
        ]}
      />
    </Form>
  );
};

const RegisterEmployeePage = (): JSX.Element => {
  const navigate = useNavigate();

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
  );
};

export default RegisterEmployeePage;
