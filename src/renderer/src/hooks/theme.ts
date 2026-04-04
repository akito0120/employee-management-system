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
    borderRadius: 2,
    colorBorder: theme === 'light' ? '#BBB' : '#333',
    colorBorderSecondary: theme === 'light' ? '#BBB' : '#333',
    colorSuccess: '#6eb63f',
    colorError: '#c43131',
    colorWarning: '#ca8a04',
    fontFamily: 'Inter'
  };
};
