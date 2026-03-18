import { AliasToken } from 'antd/es/theme/internal'
import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type Theme = 'light' | 'dark'
const defaultTheme: Theme = 'light'

export const themeAtom = atomWithStorage<Theme>('theme', defaultTheme)
export const primaryColorAtom = atomWithStorage<string>('primary-color', '#2320b7')

export const useThemeToken = (): Partial<AliasToken> => {
  const primaryColor = useAtomValue(primaryColorAtom)

  return {
    colorPrimary: primaryColor,
    borderRadius: 3
  }
}
