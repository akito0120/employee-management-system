/** @jsxImportSource @emotion/react */
import { CheckOutlined, DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import ButtonWithConfirm from '@renderer/components/ButtonWithConfirm';
import {
  useAffiliationOptions,
  useCountryOptions,
  useEmployeeStatusOptions
} from '@renderer/hooks/options';
import { useActiveDisabledStyle } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import {
  App,
  Breadcrumb,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  Progress,
  Select,
  theme
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { EditEmployeeRequest } from 'src/shared/dto/employees/edit-employee.dto';

import { EmployeeEligibilities } from './EmployeeEligibilities';

const EmployeeDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<boolean>(false);
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const params = useParams();
  const id = Number(params.id);
  const { data: empl, refetch } = trpc.employees.findEmployeeById.useQuery(id);
  const statusOptions = useEmployeeStatusOptions();
  const affilicationOptions = useAffiliationOptions();
  const countryOptions = useCountryOptions();

  const [form] = Form.useForm<EditEmployeeRequest>();
  const { mutateAsync: edit, isPending: editPending } = trpc.employees.editEmployee.useMutation({
    onSuccess: () => {
      refetch();
      setEditing(false);
    },
    onError: () => message.error(t('global.somethingWentWrongMsg'))
  });

  const submit = async () => {
    const values = await form.validateFields();
    await edit({ ...values, id });
  };

  const formCss = useActiveDisabledStyle();

  const { mutate: deleteEmpl, isPending: deletePending } =
    trpc.employees.deleteEmployeeById.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

  if (!empl) return null;

  return (
    <Flex gap="large" vertical style={{ padding: '2rem', height: '100%' }}>
      <Breadcrumb
        items={[{ title: t('global.employees') }, { title: `${empl.firstName} ${empl.lastName}` }]}
      />

      <EmployeeEligibilities id={empl.id} />

      <Form
        form={form}
        disabled={!editing}
        css={formCss}
        variant={editing ? 'outlined' : 'borderless'}
      >
        <Flex vertical gap="middle">
          <Descriptions
            bordered
            column={2}
            items={[
              {
                label: t('employees.field.firstName'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="firstName"
                    rules={[{ required: true }]}
                    initialValue={empl.firstName}
                  >
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.lastName'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="lastName"
                    rules={[{ required: true }]}
                    initialValue={empl.lastName}
                  >
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.birthDate'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="birthDate"
                    rules={[{ required: true }]}
                    initialValue={new Date(empl.birthDate)}
                    getValueFromEvent={(e: dayjs.Dayjs) => e.toDate()}
                    getValueProps={(value) => ({ value: dayjs(value) })}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.code'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="code"
                    rules={[{ required: true }]}
                    initialValue={empl.code}
                  >
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.status'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="status"
                    rules={[{ required: true }]}
                    initialValue={empl.status}
                  >
                    <Select options={statusOptions} style={{ width: '100%' }} />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.affiliation'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="organizationId"
                    rules={[{ required: true }]}
                    initialValue={empl.affiliation?.organizationId}
                  >
                    <Select options={affilicationOptions} style={{ width: '100%' }} />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.position'),
                children: `${empl.position.name} (G${empl.position.grade})`
              },
              { label: t('employees.field.baseSalary'), children: `€${empl.baseSalary}` },
              {
                label: t('employees.field.lastRaiseDate'),
                children: format(empl.lastRaiseDate, 'yyyy-MM-dd')
              },
              {
                label: t('employees.field.raiseCount'),
                children: (
                  <Flex align="center" style={{ width: '100%' }}>
                    <Progress
                      steps={empl.position.raiseCount}
                      percent={(empl.raiseCount / empl.position.raiseCount) * 100}
                      format={() => `${empl.raiseCount} / ${empl.position.raiseCount}`}
                      strokeColor={token.colorPrimary}
                      size={10}
                      styles={{ indicator: { color: token.colorText } }}
                    />
                  </Flex>
                )
              }
            ]}
          />

          <Descriptions
            bordered
            column={2}
            items={[
              {
                label: t('employees.field.email'),
                children: (
                  <Form.Item<EditEmployeeRequest> noStyle name="email" initialValue={empl.email}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.phoneNumber'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="phoneNumber"
                    initialValue={empl.phoneNumber}
                  >
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.country'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="country"
                    initialValue={empl.country}
                  >
                    <Select options={countryOptions} style={{ width: '100%' }} />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.state'),
                children: (
                  <Form.Item<EditEmployeeRequest> noStyle name="state" initialValue={empl.state}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.city'),
                children: (
                  <Form.Item<EditEmployeeRequest> noStyle name="city" initialValue={empl.city}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.line1'),
                children: (
                  <Form.Item<EditEmployeeRequest> noStyle name="line1" initialValue={empl.line1}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.line2'),
                children: (
                  <Form.Item<EditEmployeeRequest> noStyle name="line2" initialValue={empl.line2}>
                    <Input />
                  </Form.Item>
                )
              },
              {
                label: t('employees.field.postalCode'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="postalCode"
                    initialValue={empl.postalCode}
                  >
                    <Input />
                  </Form.Item>
                )
              }
            ]}
          />

          <Descriptions
            bordered
            items={[
              {
                label: t('employees.field.remarks'),
                children: (
                  <Form.Item<EditEmployeeRequest>
                    noStyle
                    name="remarks"
                    initialValue={empl.remarks}
                  >
                    <TextArea autoSize={{ minRows: 3 }} />
                  </Form.Item>
                )
              }
            ]}
          />
        </Flex>
      </Form>

      {editing ? (
        <Flex justify="center" gap="middle">
          <StyledButton
            variant="filled"
            color="default"
            icon={<LeftOutlined />}
            onClick={() => {
              setEditing(false);
              form.resetFields();
            }}
          >
            {t('global.cancel')}
          </StyledButton>

          <StyledButton
            variant="filled"
            color="primary"
            icon={<CheckOutlined />}
            onClick={submit}
            loading={editPending}
          >
            {t('global.confirm')}
          </StyledButton>
        </Flex>
      ) : (
        <Flex justify="center" gap="middle">
          <StyledButton
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            variant="filled"
            color="default"
          >
            {t('global.back')}
          </StyledButton>

          <StyledButton
            icon={<EditOutlined />}
            variant="filled"
            color="primary"
            onClick={() => setEditing(true)}
          >
            {t('global.edit')}
          </StyledButton>

          <ButtonWithConfirm
            text={t('global.delete')}
            icon={<DeleteOutlined />}
            title={t('employees.delete.confirmMsg')}
            loading={deletePending}
            onConfirm={() => deleteEmpl(id)}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default EmployeeDetailPage;
