import { css } from '@emotion/react'
import { theme } from 'antd'

export default () => {
  const {
    token: { colorBgContainer, colorBgLayout, colorBorder },
  } = theme.useToken()

  return css({
    '.collapsed-btn': {
      position: 'absolute',
      right: -11,
      top: 60,
      width: 20,
      height: 40,
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${colorBorder}`,
      background: colorBgContainer,
      cursor: 'pointer',
      '&:hover': {
        background: colorBgLayout,
      },
      '.icon': {
        transition: '0.4s',
        '&.collapsed': {
          transform: 'rotateY(-180deg)',
        },
      },
    },
  })
}
