import { CheckOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface ButtonWithConfirmProps {
  text?: string;
  icon?: ReactNode;
  title?: string;
  loading?: boolean;
  onConfirm?: () => void;
}

const ButtonWithConfirm = ({ text, onConfirm, loading, title, icon }: ButtonWithConfirmProps) => {
  const { modal } = App.useApp();
  const { t } = useTranslation();

  const onClick = () => {
    modal.confirm({
      title,
      onOk: onConfirm,
      okText: t('global.confirm'),
      okButtonProps: {
        variant: 'filled',
        color: 'primary',
        icon: <CheckOutlined />,
        loading
      },
      cancelText: t('global.cancel'),
      cancelButtonProps: { variant: 'filled', color: 'default' }
    });
  };

  return (
    <Button onClick={onClick} variant="filled" color="primary" icon={icon}>
      {text}
    </Button>
  );
};

export default ButtonWithConfirm;
