import { KeyOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Button, Form, Input, Modal } from 'antd';
import { JSX, useState } from 'react';
import { ChangePasswordRequest } from 'src/shared/dto/auth/change-password.dto';

type FormType = ChangePasswordRequest & {
  confirmPassword: string;
};

const ChangePasswordModal = (): JSX.Element => {
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
        Change Password
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Change Password"
        // okText="Confirm"
        onOk={() => onFinish()}
        okButtonProps={{ loading: changePasswordPending }}
      >
        <Form layout="vertical" style={{ padding: '1rem' }} form={form}>
          <Form.Item<FormType>
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true }, { min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FormType>
            name="newPassword"
            label="New Password"
            rules={[{ required: true }, { min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FormType>
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true },
              { min: 6 },
              {
                validator: (_, value) => {
                  if (typeof value == 'string' && value === newPassword) return Promise.resolve();
                  return Promise.reject('Please enter new password');
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
