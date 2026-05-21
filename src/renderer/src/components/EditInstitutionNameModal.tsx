import { CheckOutlined, SettingOutlined } from '@ant-design/icons';
import { useCurrency, useInstitutionName } from '@renderer/hooks/metadata';
import { useCurrencyOptions } from '@renderer/hooks/options';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type FormType = {
  institutionName: string;
  currency: string;
};

const EditInstitutionNameModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [institutionName, setInstitutionName] = useInstitutionName();
  const [currency, setCurrency] = useCurrency();

  const [form] = Form.useForm<FormType>();

  const [value, setValue] = useState(institutionName);
  const currencyOptions = useCurrencyOptions();

  const confirm = async () => {
    const values = await form.validateFields();
    setInstitutionName(values.institutionName);
    setCurrency(values.currency);
    setOpen(false);
  };

  return (
    <>
      <Button
        icon={<SettingOutlined />}
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
        title={t('institutionSettings.title')}
      >
        <Form form={form} style={{ padding: '1rem' }} layout="vertical">
          <Form.Item<FormType>
            label={t('institutionSettings.institutionName')}
            name="institutionName"
            initialValue={institutionName}
          >
            <Input onChange={(e) => setValue(e.currentTarget.value)} value={value} />
          </Form.Item>

          <Form.Item<FormType>
            label={t('institutionSettings.currency')}
            name="currency"
            initialValue={currency}
          >
            <Select options={currencyOptions} showSearch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditInstitutionNameModal;
