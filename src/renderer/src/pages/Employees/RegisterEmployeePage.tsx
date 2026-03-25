import { CheckOutlined, LeftOutlined, PictureOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import {
  App,
  Breadcrumb,
  Button,
  Checkbox,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Typography
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Dragger from 'antd/es/upload/Dragger';
import dayjs from 'dayjs';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { RegisterEmployeeRequest } from 'src/shared/dto/employees/register-employee.dto';
import { GetSalaryRangeRequest } from 'src/shared/dto/positions/get-salary-range.dto';

countries.registerLocale(enLocale);

type FormType = Omit<RegisterEmployeeRequest, 'birthDate'> & {
  birthDate: dayjs.Dayjs;
};

const RegisterEmployeeForm = ({ form }: { form: FormInstance<FormType> }) => {
  const positionId = Form.useWatch<number | undefined>('positionId', form);
  const jobGradeLevel = Form.useWatch<GetSalaryRangeRequest['jobGradeLevel']>(
    'jobGradeLevel',
    form
  );
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery();
  const { data: jobGradeLevelOptions } = trpc.positions.getJobGradeLevelOptions.useQuery({
    positionId: positionId || null
  });
  const { data: salaryRange } = trpc.positions.getSalaryRange.useQuery(
    {
      positionId,
      jobGradeLevel
    },
    { enabled: positionId !== undefined && jobGradeLevel !== undefined }
  );
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();
  const { data: unitOptions } = trpc.units.getUnitOptions.useQuery();

  const employeeStatusOptions: { label: string; value: FormType['status'] }[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_LEAVE', label: 'On Leave' },
    { value: 'SICK_LEAVE', label: 'Sick Leave' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'PARENTAL_LEAVE', label: 'Parental Leave' },
    { value: 'NOTICE_PERIOD', label: 'Notice Period' },
    { value: 'TERMINATED', label: 'Terminated' }
  ];

  const countryObj = countries.getNames('en', { select: 'official' });
  const countryOptions = Object.entries(countryObj).map(([code, name]) => ({
    value: code,
    label: name
  }));

  return (
    <Form variant="filled" form={form}>
      <Descriptions
        bordered
        column={2}
        items={[
          {
            label: 'First Name',
            children: (
              <Form.Item<FormType> required noStyle name="firstName">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Last Name',
            children: (
              <Form.Item<FormType> required noStyle name="lastName">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Birth Date',
            children: (
              <Form.Item<FormType> required noStyle name="birthDate">
                <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: 'Employee Code',
            children: (
              <Form.Item<FormType> required noStyle name="code">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Status',
            children: (
              <Form.Item<FormType> required noStyle name="status">
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
              <Flex gap="middle" align="center">
                <Form.Item<FormType> noStyle name="organizationId">
                  <Select
                    style={{ width: '10rem' }}
                    options={[
                      { label: 'Departments', options: deptOptions },
                      { label: 'Sub Departments', options: subDeptOptions },
                      { label: 'Units', options: unitOptions }
                    ]}
                  />
                </Form.Item>

                <Form.Item noStyle>
                  <Checkbox>Register as Manager</Checkbox>
                </Form.Item>
              </Flex>
            )
          },
          {
            label: 'Position',
            children: (
              <Flex gap="middle">
                <Form.Item<FormType> required noStyle name="positionId">
                  <Select
                    style={{ width: '12rem' }}
                    placeholder="Position"
                    options={positionOptions}
                    allowClear
                  />
                </Form.Item>

                <Form.Item<FormType> required noStyle name="jobGradeLevel">
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
                <Form.Item<FormType> required style={{ margin: 0 }} name="baseSalary">
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
              <Form.Item<FormType> required noStyle name="email">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Phone Number',
            children: (
              <Form.Item<FormType> noStyle name="phoneNumber">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Country',
            children: (
              <Form.Item<FormType> noStyle name="country">
                <Select style={{ width: '100%' }} options={countryOptions} />
              </Form.Item>
            )
          },
          {
            label: 'State',
            children: (
              <Form.Item<FormType> noStyle name="state">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'City',
            children: (
              <Form.Item<FormType> noStyle name="city">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Line 1',
            children: (
              <Form.Item<FormType> noStyle name="line1">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Line 2',
            children: (
              <Form.Item<FormType> noStyle name="line2">
                <Input />
              </Form.Item>
            )
          },
          {
            label: 'Postal Code',
            children: (
              <Form.Item<FormType> noStyle name="postalCode">
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
              <Form.Item<FormType> noStyle name="remarks">
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
  const { message } = App.useApp();

  const [form] = Form.useForm<FormType>();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.employees.registerEmployee.useMutation({
      onSuccess: () => navigate('/employees'),
      onError: (error) => {
        console.log(error);
        message.error('Failed to register');
      }
    });

  const submit = async () => {
    const values = await form.validateFields();
    await register({ ...values, birthDate: values.birthDate.toDate() });
  };

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

      <RegisterEmployeeForm form={form} />

      <Flex style={{ width: '100%' }} justify="center" gap="middle">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate('/employees')}
          variant="filled"
          color="default"
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

export default RegisterEmployeePage;
