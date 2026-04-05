import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { useAffiliationOptions, useEmployeeStatusOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import {
  App,
  Breadcrumb,
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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery({ grade: null });
  const affiliationOptions = useAffiliationOptions();
  const employeeStatusOptions = useEmployeeStatusOptions();

  const countryObj = countries.getNames('en', { select: 'official' });
  const countryOptions = Object.entries(countryObj).map(([code, name]) => ({
    value: code,
    label: name
  }));

  return (
    <Form variant="outlined" form={form}>
      <Descriptions
        bordered
        column={2}
        items={[
          {
            label: `* ${t('employees.field.firstName')}`,
            children: (
              <Form.Item<FormType> required noStyle name="firstName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: `* ${t('employees.field.lastName')}`,
            children: (
              <Form.Item<FormType> required noStyle name="lastName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: `* ${t('employees.field.birthDate')}`,
            children: (
              <Form.Item<FormType> required noStyle name="birthDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: `* ${t('employees.field.code')}`,
            children: (
              <Form.Item<FormType> required noStyle name="code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )
          },
          {
            label: `* ${t('employees.field.status')}`,
            children: (
              <Form.Item<FormType> required noStyle name="status" rules={[{ required: true }]}>
                <Select style={{ width: '100%' }} options={employeeStatusOptions} />
              </Form.Item>
            )
          },
          {
            label: `* ${t('employees.field.position')}`,
            children: (
              <Form.Item<FormType> required noStyle name="positionId" rules={[{ required: true }]}>
                <Select style={{ width: '100%' }} options={positionOptions} allowClear />
              </Form.Item>
            )
          },
          {
            label: `* ${t('employees.field.affiliation')}`,
            span: 'filled',
            children: (
              <Flex gap="middle" align="center">
                <Form.Item<FormType> noStyle name="organizationId" rules={[{ required: true }]}>
                  <Select style={{ width: '100%' }} options={affiliationOptions} />
                </Form.Item>
              </Flex>
            )
          },
          {
            label: t('employees.field.lastPromotionDate'),
            children: (
              <Form.Item<FormType> noStyle name="lastPromotionDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.lastRaiseDate'),
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
            label: t('employees.field.email'),
            children: (
              <Form.Item<FormType> required noStyle name="email">
                <Input />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.phoneNumber'),
            children: (
              <Form.Item<FormType> noStyle name="phoneNumber">
                <Input />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.country'),
            children: (
              <Form.Item<FormType> noStyle name="country">
                <Select style={{ width: '100%' }} options={countryOptions} allowClear />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.state'),
            children: (
              <Form.Item<FormType> noStyle name="state">
                <Input />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.city'),
            children: (
              <Form.Item<FormType> noStyle name="city">
                <Input />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.line1'),
            children: (
              <Form.Item<FormType> noStyle name="line1">
                <Input />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.line2'),
            children: (
              <Form.Item<FormType> noStyle name="line2">
                <Input />
              </Form.Item>
            )
          },
          {
            label: t('employees.field.postalCode'),
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
            label: t('employees.field.remarks'),
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

const RegisterEmployeePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [form] = Form.useForm<FormType>();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.employees.registerEmployee.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
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
      <Breadcrumb items={[{ title: t('global.employees') }, { title: t('global.register') }]} />

      <RegisterEmployeeForm form={form} />

      <Flex style={{ width: '100%' }} justify="center" gap="middle">
        <StyledButton
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          variant="filled"
          color="default"
        >
          {t('global.cancel')}
        </StyledButton>
        <StyledButton
          icon={<CheckOutlined />}
          variant="filled"
          color="primary"
          onClick={submit}
          loading={registerPending}
        >
          {t('global.confirm')}
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export default RegisterEmployeePage;
