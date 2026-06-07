import { ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'

const cssVar = (name: string) => {
  if (typeof window === 'undefined') return ''

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: cssVar('--color-primary'),
        colorSuccess: cssVar('--color-success'),
        colorWarning: cssVar('--color-warning'),
        colorError: cssVar('--color-danger'),
        colorInfo: cssVar('--color-info'),
        colorText: cssVar('--color-heading'),
        colorTextSecondary: cssVar('--color-muted'),
        colorBgBase: cssVar('--color-surface-muted'),
        colorBgContainer: cssVar('--color-surface'),
        colorBorder: cssVar('--color-border'),
        controlItemBgActive: cssVar('--color-primary'),
        borderRadius: 8,
        fontFamily: cssVar('--font-sans'),
      },
      components: {
        Button: {
          controlHeight: 40,
          fontWeight: 700,
          primaryShadow: cssVar('--shadow-soft'),
        },
        Card: {
          borderRadiusLG: 8,
        },
				Input: {
					controlHeight: 42,
				},
				Select: {
					controlHeight: 42,
					optionActiveBg: cssVar('--color-primary-soft'),
					optionSelectedBg: cssVar('--color-primary'),
					optionSelectedColor: cssVar('--color-white'),
					optionSelectedFontWeight: 400,
				},
			},
		}}
  >
    {children}
  </ConfigProvider>
)
