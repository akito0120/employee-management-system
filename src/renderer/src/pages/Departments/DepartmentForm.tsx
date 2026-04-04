/** @jsxImportSource @emotion/react */
import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { App, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { FindDepartmentByIdResponse } from 'src/shared/dto/departments/find-department-by-id.dto';
import { RegisterDepartmentRequest } from 'src/shared/dto/departments/register-department.dto';

interface DepartmentFormProps {
  department?: FindDepartmentByIdResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
  editing?: boolean;
}

const disabledBlackStyle = css`
  .ant-input-disabled,
  .ant-input-number-disabled,
  .ant-input-affix-wrapper-disabled,
  .ant-input-disabled input {
    color: rgba(0, 0, 0, 0.88) !important;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.88) !important;
    background-color: #fff !important;
  }

  .ant-select-disabled,
  .ant-select-selection-item {
    color: rgba(0, 0, 0, 0.88) !important;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.88) !important;
    background-color: #fff !important;
  }
`;

const DepartmentForm = ({ department, onCancel, onSuccess, editing }: DepartmentFormProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const affiliationStatusOptions = useAffiliationStatusOptions();
  const [form] = Form.useForm<RegisterDepartmentRequest>();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.departments.registerDepartment.useMutation({
      onSuccess: onSuccess,
      onError: () => message.error('Something went wrong')
    });

  const submit = async () => {
    const values = await form.validateFields();
    const id = department?.id;
    await register({ ...values, id });
  };

  return (
    <Form
      variant={editing ? 'outlined' : 'borderless'}
      form={form}
      disabled={!editing}
      css={disabledBlackStyle}
    >
      <Flex vertical gap="middle">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('departments.field.name')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={department?.name}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('departments.field.code')}`,
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={department?.code}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('departments.field.status')}`,
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="status"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={department?.status}
                >
                  <Select style={{ width: '100%' }} options={affiliationStatusOptions} />
                </Form.Item>
              )
            },
            {
              label: t('departments.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterDepartmentRequest>
                  name="description"
                  noStyle
                  initialValue={department?.description}
                >
                  <TextArea autoSize={{ minRows: 5 }} />
                </Form.Item>
              )
            }
          ]}
        />

        {editing && (
          <Flex justify="center" gap="middle">
            <Button
              icon={<LeftOutlined />}
              variant="filled"
              color="default"
              onClick={() => {
                onCancel && onCancel();
                form.resetFields();
              }}
            >
              {t('global.cancel')}
            </Button>

            <Button
              variant="filled"
              color="primary"
              icon={<CheckOutlined />}
              onClick={submit}
              loading={registerPending}
            >
              {t('global.confirm')}
            </Button>
          </Flex>
        )}
      </Flex>
    </Form>
  );
};

export default DepartmentForm;
