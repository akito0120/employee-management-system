import { Select, SelectProps } from 'antd';
import { LanguagesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface LanguageSelectProps {
  variant?: SelectProps['variant'];
}

const LanguageSelect = ({ variant }: LanguageSelectProps) => {
  const { i18n } = useTranslation();

  return (
    <Select
      value={i18n.language}
      options={[
        { label: '日本語', value: 'ja' },
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' }
      ]}
      onSelect={(value) => i18n.changeLanguage(value)}
      style={{ width: '100%' }}
      styles={{ content: { display: 'flex', justifyContent: 'center' } }}
      prefix={<LanguagesIcon size={17} strokeWidth={1.5} />}
      variant={variant}
    />
  );
};

export default LanguageSelect;
