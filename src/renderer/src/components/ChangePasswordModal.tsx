import { KeyOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChangePasswordRequest } from 'src/shared/dto/auth/change-password.dto';

type FormType = ChangePasswordRequest & {
  confirmPassword: string;
};

const ChangePasswordModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { message } = App.useApp();

  const { mutateAsync: changePassword, isPending: changePasswordPending } =
    trpc.auth.changePassword.useMutation({
      onSuccess: () => {
        message.success('Successfully updated password');
        setOpen(false);
      },
      onError: () => message.error('Failed to update password')
    });

  const [form] = Form.useForm<FormType>();
  const newPassword = Form.useWatch<string>('newPassword', form);
  const onFinish = async (): Promise<void> => {
    const data = await form.validateFields();
    await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} type="text" icon={<KeyOutlined />}>
        {t('sidebar.userCard.changePassword')}
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={t('sidebar.changePasswordModal.title')}
        okText={t('global.apply')}
        cancelText={t('global.cancel')}
        onOk={() => onFinish()}
        okButtonProps={{ loading: changePasswordPending, variant: 'filled', color: 'primary' }}
        cancelButtonProps={{ variant: 'filled', color: 'default' }}
      >
        <Form layout="vertical" style={{ padding: '1rem' }} form={form}>
          <Form.Item<FormType>
            name="currentPassword"
            label={t('sidebar.changePasswordModal.currentPasswordLabel')}
            rules={[
              {
                required: true,
                message: t('sidebar.changePasswordModal.currentPasswordRequiredValidationError')
              },
              {
                min: 6,
                message: t('sidebar.changePasswordModal.currentPasswordMinLengthValidationError')
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FormType>
            name="newPassword"
            label={t('sidebar.changePasswordModal.newPasswordLabel')}
            rules={[
              {
                required: true,
                message: t('sidebar.changePasswordModal.newPasswordRequiredValidationError')
              },
              {
                min: 6,
                message: t('sidebar.changePasswordModal.newPasswordMinLengthValidationError')
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FormType>
            name="confirmPassword"
            label={t('sidebar.changePasswordModal.confirmPasswordLabel')}
            rules={[
              {
                required: true,
                message: t('sidebar.changePasswordModal.confirmPasswordRequiredValidationError')
              },
              {
                validator: (_, value) => {
                  if (typeof value == 'string' && value === newPassword) return Promise.resolve();
                  return Promise.reject(t('sidebar.changePasswordModal.passwordUnmatchError'));
                }
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
