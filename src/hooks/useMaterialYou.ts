import { ThemeConfig } from 'antd'
import { Hct, themeFromSourceColor, argbFromHex, applyTheme, hexFromArgb } from '@material/material-color-utilities'

export function useMaterialYou(color: string): ThemeConfig['token'] {
  const theme = themeFromSourceColor(argbFromHex(color))
  const colors = theme.schemes.light.toJSON()

  applyTheme(theme, { target: document.body })

  const primary = [hexFromArgb(colors.primary), hexFromArgb(colors.primaryContainer)]

  return {
    colorPrimary: hexFromArgb(colors.primary),
    colorBgLayout: hexFromArgb(colors.background),
    // colorBorderSecondary: hexFromArgb(colors.surfaceVariant),
    // colorBorderSecondary: hexFromArgb(colors.outlineVariant),
    colorBgContainer: hexFromArgb(colors.onPrimary),
    fontFamily: 'Ubuntu',
    fontFamilyCode: '"JetBrains Mono","Menlo","Consolas"',
  }
}
