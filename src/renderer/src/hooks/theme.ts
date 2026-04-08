import { css } from '@emotion/react';
import { theme } from 'antd';
import { AliasToken } from 'antd/es/theme/internal';
import { useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Theme = 'light' | 'dark';
const defaultTheme: Theme = 'light';

export const themeAtom = atomWithStorage<Theme>('theme', defaultTheme);
export const primaryColorAtom = atomWithStorage<string>('primary-color', '#2320b7');

export const useThemeToken = (): Partial<AliasToken> => {
  const primaryColor = useAtomValue(primaryColorAtom);
  const theme = useAtomValue(themeAtom);

  return {
    colorPrimary: primaryColor,
    borderRadius: 3,
    colorBorder: theme === 'light' ? '#DDD' : '#333',
    colorBorderSecondary: theme === 'light' ? '#DDD' : '#333',
    colorSuccess: '#6eb63f',
    colorError: '#c43131',
    colorWarning: '#ca8a04',
    colorInfo: '#3b82f6',
    fontFamily: 'IBMPlexSansJP',
    controlHeight: 35,
    motion: false,
    marginXXS: 10
  };
};

export const useActiveDisabledStyle = () => {
  const { token } = theme.useToken();

  return css`
    .ant-input-disabled,
    .ant-input-number-disabled,
    .ant-input-affix-wrapper-disabled,
    .ant-input-disabled input {
      color: ${token.colorText} !important;
      -webkit-text-fill-color: ${token.colorText} !important;
      background-color: transparent !important;
    }

    .ant-select-disabled,
    .ant-select-selection-item {
      color: ${token.colorText}!important;
      -webkit-text-fill-color: ${token.colorText} !important;
      background-color: transparent !important;
    }

    .ant-picker-disabled input {
      color: ${token.colorText} !important;
    }
  `;
};
