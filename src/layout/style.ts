import { css } from '@emotion/react'
import { theme } from 'antd'

export default () => {
  const {
    token: { colorBgContainer, colorBgLayout, colorBorder, colorTextSecondary, borderRadius },
  } = theme.useToken()

  return css({
    // '#logo': {
    //   cursor: 'pointer',
    //   ':hover': {
    //     path: {
    //       fill: colorTextSecondary,
    //     },
    //   },
    // },
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
      cursor: 'pointer',
      '.icon': {
        transition: '0.4s',
        '&.collapsed': {
          transform: 'rotateY(-180deg)',
        },
      },
    },
    '.ant-layout-header .ant-menu-item': {
      borderRadius: borderRadius,
    },
  })
}
