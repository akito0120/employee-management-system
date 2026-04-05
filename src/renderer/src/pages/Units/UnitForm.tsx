/** @jsxImportSource @emotion/react */
import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { useAffiliationStatusOptions } from '@renderer/hooks/options';
import { useActiveDisabledStyle } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import { App, Descriptions, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { FindUnitByIdResponse } from 'src/shared/dto/units/find-unit-by-id.dto';
import { RegisterUnitRequest } from 'src/shared/dto/units/register-unit.dto';

interface UnitFormProps {
  unit?: FindUnitByIdResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
  editing?: boolean;
}

const UnitForm = ({ editing, onCancel, onSuccess, unit }: UnitFormProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const affiliationStatusOptions = useAffiliationStatusOptions();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();
  const [form] = Form.useForm<RegisterUnitRequest>();
  const { mutateAsync: register, isPending: registerPending } = trpc.units.registerUnit.useMutation(
    {
      onSuccess: onSuccess,
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    }
  );

  const submit = async () => {
    const values = await form.validateFields();
    const id = unit?.id;
    await register({ ...values, id });
  };

  const formCss = useActiveDisabledStyle();

  return (
    <Form
      variant={editing ? 'outlined' : 'borderless'}
      disabled={!editing}
      form={form}
      css={formCss}
    >
      <Flex vertical gap="large">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('units.field.name')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={unit?.name}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('units.field.code')}`,
              children: (
                <Form.Item<RegisterUnitRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={unit?.code}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('units.field.status')}`,
              children: (
                <Form.Item<RegisterUnitRequest>
                  name="status"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={unit?.status}
                >
                  <Select style={{ width: '100%' }} options={affiliationStatusOptions} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('units.field.subDepartment')}`,
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest>
                  noStyle
                  name="subDepartmentId"
                  rules={[{ required: true }]}
                  initialValue={unit?.subDepartmentId}
                >
                  <Select style={{ width: '100%' }} options={subDeptOptions} />
                </Form.Item>
              )
            },
            {
              label: t('units.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterUnitRequest>
                  name="description"
                  noStyle
                  initialValue={unit?.description}
                >
                  <TextArea autoSize={{ minRows: 5 }} />
                </Form.Item>
              )
            }
          ]}
        />

        {editing && (
          <Flex gap="middle" justify="center">
            <StyledButton
              variant="filled"
              color="default"
              onClick={() => {
                onCancel && onCancel();
                form.resetFields();
              }}
              icon={<LeftOutlined />}
            >
              {t('global.cancel')}
            </StyledButton>

            <StyledButton
              variant="filled"
              color="primary"
              onClick={submit}
              icon={<CheckOutlined />}
              loading={registerPending}
            >
              {t('global.confirm')}
            </StyledButton>
          </Flex>
        )}
      </Flex>
    </Form>
  );
};

export default UnitForm;
