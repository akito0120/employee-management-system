/** @jsxImportSource @emotion/react */

import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { disabledBlackStyle } from '@renderer/shared/emotion-styles';
import { trpc } from '@renderer/trpc';
import { App, Button, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { FindSubDepartmentByIdResponse } from 'src/shared/dto/sub-departments/find-sub-department-by-id.dto';
import { RegisterSubDepartmentRequest } from 'src/shared/dto/sub-departments/register-sub-department.dto';

interface SubDepartmentFormProps {
  subDepartment?: FindSubDepartmentByIdResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
  editing?: boolean;
}

const SubDepartmentForm = ({
  subDepartment,
  editing,
  onCancel,
  onSuccess
}: SubDepartmentFormProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const affiliationStatusOptions = useAffiliationStatusOptions();
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const [form] = Form.useForm<RegisterSubDepartmentRequest>();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.subDepartments.registerSubDepartment.useMutation({
      onSuccess: onSuccess,
      onError: () => message.error('Something went wrong')
    });

  const submit = async () => {
    const values = await form.validateFields();
    const id = subDepartment?.id;
    await register({ ...values, id });
  };

  return (
    <Form
      variant={editing ? 'outlined' : 'borderless'}
      form={form}
      css={disabledBlackStyle}
      disabled={!editing}
    >
      <Flex vertical gap="middle">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('subDepartments.field.name')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={subDepartment?.name}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('subDepartments.field.code')}`,
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={subDepartment?.code}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('subDepartments.field.status')}`,
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="status"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={subDepartment?.status}
                >
                  <Select style={{ width: '100%' }} options={affiliationStatusOptions} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('subDepartments.field.department')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="departmentId"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={subDepartment?.departmentId}
                >
                  <Select style={{ width: '100%' }} options={deptOptions} />
                </Form.Item>
              )
            },
            {
              label: t('subDepartments.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterSubDepartmentRequest>
                  name="description"
                  noStyle
                  initialValue={subDepartment?.description}
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
              icon={<CheckOutlined />}
              variant="filled"
              color="primary"
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

export default SubDepartmentForm;
