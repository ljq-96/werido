import { css } from '@emotion/react'
import { theme } from 'antd'

export default function useStyle() {
  const {
    token: { colorBorderSecondary, colorTextSecondary, colorBgTextHover, colorBgContainer, colorPrimary },
  } = theme.useToken()
  return css({
    width: 256,
    padding: '15px 4px 0',
    '.head': {
      padding: '0 8px 15px',
      marginBottom: 8,
      borderBottom: `1px solid ${colorBorderSecondary}`,
      '.title': {
        fontWeight: 600,
      },
    },
    '.colpased-btns': {
      '.ant-btn': {
        color: colorTextSecondary,
      },
    },
    '.ant-skeleton': {
      padding: 8,
    },
    '.search': {
      background: colorBgTextHover,
      border: `1px solid transparent`,
      marginBottom: 8,
      '&.ant-input-affix-wrapper-focused': {
        background: colorBgContainer,
        border: `1px solid ${colorPrimary}`,
      },
    },
    '.catalog-container': {
      height: 'calc(100vh - 170px)',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: 0,
      },
    },
    '.ant-modal .catalog-container': {
      height: 'calc(100vh - 320px)',
    },
    '.catalog-title-container': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
}
