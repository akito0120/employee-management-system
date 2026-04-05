import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { useInstitutionName } from '@renderer/hooks/metadata';
import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EditInstitutionNameModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [institutionName, setInstitutionName] = useInstitutionName();
  const [value, setValue] = useState(institutionName);

  const confirm = () => {
    setInstitutionName(value);
    setOpen(false);
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        variant="text"
        color="default"
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        onOk={confirm}
        onCancel={() => setOpen(false)}
        okText={t('global.confirm')}
        okButtonProps={{ variant: 'filled', color: 'primary', icon: <CheckOutlined /> }}
        cancelText={t('global.cancel')}
        cancelButtonProps={{ variant: 'filled', color: 'default' }}
        title={t('global.editInstitutionModalTitle')}
      >
        <Form style={{ padding: '1rem' }} layout="vertical">
          <Form.Item label={t('global.institutionName')}>
            <Input onChange={(e) => setValue(e.currentTarget.value)} value={value} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditInstitutionNameModal;
