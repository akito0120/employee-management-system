import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { App, Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditProfileRequest } from 'src/shared/dto/auth/edit-profile.dto';

const EditProfileModal = () => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [form] = Form.useForm<EditProfileRequest>();
  const { data: me, refetch } = trpc.auth.getMe.useQuery();
  const { mutateAsync, isPending } = trpc.auth.editProfile.useMutation({
    onSuccess: () => {
      refetch();
      setOpen(false);
    },
    onError: () => message.error(t('global.somethingWentWrongMsg'))
  });

  const submit = async () => {
    const values = await form.validateFields();
    await mutateAsync(values);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="text" color="default" icon={<UserOutlined />}>
        {t('sidebar.userCard.editProfile')}
      </Button>

      <Modal
        title={t('sidebar.editProfileModal.title')}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={submit}
        okButtonProps={{
          variant: 'filled',
          color: 'primary',
          icon: <CheckOutlined />,
          loading: isPending
        }}
        cancelButtonProps={{
          variant: 'filled',
          color: 'default'
        }}
        okText={t('global.confirm')}
        cancelText={t('global.cancel')}
      >
        <Form layout="vertical" style={{ padding: '1rem' }} form={form}>
          <Form.Item<EditProfileRequest>
            label={t('sidebar.editProfileModal.firstNameLabel')}
            name="firstName"
            rules={[
              { required: true, message: t('sidebar.editProfileModal.firstNameRequiredError') }
            ]}
            initialValue={me?.firstName}
          >
            <Input />
          </Form.Item>

          <Form.Item<EditProfileRequest>
            label={t('sidebar.editProfileModal.lastNameLabel')}
            name="lastName"
            rules={[
              { required: true, message: t('sidebar.editProfileModal.lastNameRequiredError') }
            ]}
            initialValue={me?.lastName}
          >
            <Input />
          </Form.Item>

          <Form.Item<EditProfileRequest>
            label={t('sidebar.editProfileModal.emailLabel')}
            name="email"
            rules={[
              { required: true, message: t('sidebar.editProfileModal.emailRequiredError') },
              { type: 'email', message: t('sidebar.editProfileModal.emailFormatError') }
            ]}
            initialValue={me?.email}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditProfileModal;
