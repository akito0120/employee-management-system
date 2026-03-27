import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
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
  Select
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { RegisterEmployeeRequest } from 'src/shared/dto/employees/register-employee.dto';

countries.registerLocale(enLocale);

type FormType = Omit<
  RegisterEmployeeRequest,
  'birthDate' | 'lastPromotionDate' | 'lastRaiseDate'
> & {
  birthDate: dayjs.Dayjs;
  lastPromotionDate?: dayjs.Dayjs;
  lastRaiseDate?: dayjs.Dayjs;
};

const RegisterEmployeeForm = ({ form }: { form: FormInstance<FormType> }) => {
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery({ grade: null });

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
            label: '* First Name',
            children: (
              <Form.Item<FormType> required noStyle name="firstName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: '* Last Name',
            children: (
              <Form.Item<FormType> required noStyle name="lastName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: '* Birth Date',
            children: (
              <Form.Item<FormType> required noStyle name="birthDate" rules={[{ required: true }]}>
                <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: '* Employee Code',
            children: (
              <Form.Item<FormType> required noStyle name="code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: '* Status',
            children: (
              <Form.Item<FormType> required noStyle name="status" rules={[{ required: true }]}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Status"
                  options={employeeStatusOptions}
                />
              </Form.Item>
            )
          },
          {
            label: '* Position',
            children: (
              <Form.Item<FormType> required noStyle name="positionId" rules={[{ required: true }]}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Position"
                  options={positionOptions}
                  allowClear
                />
              </Form.Item>
            )
          },
          {
            label: '* Affiliation',
            span: 'filled',
            children: (
              <Flex gap="middle" align="center">
                <Form.Item<FormType> noStyle name="organizationId" rules={[{ required: true }]}>
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      { label: 'Departments', options: deptOptions },
                      { label: 'Sub Departments', options: subDeptOptions },
                      { label: 'Units', options: unitOptions }
                    ]}
                  />
                </Form.Item>

                <Form.Item<FormType>
                  noStyle
                  name="isManager"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox style={{ width: '20rem' }}>Register as Manager</Checkbox>
                </Form.Item>
              </Flex>
            )
          },
          {
            label: 'Last Promotion Date',
            children: (
              <Form.Item<FormType> noStyle name="lastPromotionDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: 'Last Raise Date',
            children: (
              <Form.Item<FormType> noStyle name="lastRaiseDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
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
                <Select style={{ width: '100%' }} options={countryOptions} allowClear />
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
    const { birthDate, lastPromotionDate, lastRaiseDate, ...values } = await form.validateFields();
    await register({
      ...values,
      birthDate: birthDate.toDate(),
      lastPromotionDate: lastPromotionDate?.toDate(),
      lastRaiseDate: lastRaiseDate?.toDate()
    });
  };

  return (
    <Flex gap="large" vertical style={{ width: '100%', height: '100%', padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Employees' }, { title: 'Register' }]} />

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
