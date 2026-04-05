/** @jsxImportSource @emotion/react */

import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { useActiveDisabledStyle } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import { App, Descriptions, Flex, Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { FindPositionByIdResponse } from 'src/shared/dto/positions/find-position-by-id.dto';
import { RegisterPositionRequest } from 'src/shared/dto/positions/register-positions.dto';

interface PositionFormProps {
  position?: FindPositionByIdResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
  editing?: boolean;
}

const PositionForm = ({ editing, onCancel, onSuccess, position }: PositionFormProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm<RegisterPositionRequest>();
  const { mutateAsync: register, isPending: registerPending } =
    trpc.positions.registerPosition.useMutation({
      onSuccess: onSuccess,
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

  const submit = async () => {
    const values = await form.validateFields();
    const id = position?.id;
    await register({ ...values, id });
  };

  const formCss = useActiveDisabledStyle();

  return (
    <Form
      form={form}
      variant={editing ? 'outlined' : 'borderless'}
      disabled={!editing}
      css={formCss}
    >
      <Flex vertical gap="middle">
        <Descriptions
          bordered
          column={2}
          items={[
            {
              label: `* ${t('positions.field.name')}`,
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="name"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={position?.name}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('positions.field.code')}`,
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="code"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={position?.code}
                >
                  <Input />
                </Form.Item>
              )
            },
            {
              label: `* ${t('positions.field.initialSalary')}`,
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="initialSalary"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={position?.initialSalary}
                >
                  <InputNumber prefix="€" style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('positions.field.raiseAmount')}`,
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="raiseAmount"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={position?.raiseAmount}
                >
                  <InputNumber prefix="€" style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: `* ${t('positions.field.grade')}`,
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="grade"
                  noStyle
                  rules={[{ required: true }]}
                  initialValue={position?.grade}
                >
                  <Select
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => ({
                      label: `G${grade}`,
                      value: grade
                    }))}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              )
            },
            {
              label: t('positions.field.timeInRole'),
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="timeInRole"
                  noStyle
                  initialValue={position?.timeInRole}
                >
                  <InputNumber suffix={t('global.months')} style={{ width: '100%' }} />
                </Form.Item>
              )
            },
            {
              label: t('positions.field.description'),
              span: 'filled',
              children: (
                <Form.Item<RegisterPositionRequest>
                  name="description"
                  noStyle
                  initialValue={position?.description}
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
              icon={<LeftOutlined />}
              onClick={() => {
                form.resetFields();
                onCancel && onCancel();
              }}
            >
              {t('global.cancel')}
            </StyledButton>

            <StyledButton
              variant="filled"
              color="primary"
              icon={<CheckOutlined />}
              onClick={submit}
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

export default PositionForm;
