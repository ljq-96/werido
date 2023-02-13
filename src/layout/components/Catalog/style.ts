import { css } from '@emotion/react'
import { theme } from 'antd'

export default function useStyle() {
  const {
    token: {
      colorBorderSecondary,
      colorText,
      colorTextSecondary,
      colorBgTextHover,
      borderRadius,
      colorBgContainer,
      colorPrimary,
    },
  } = theme.useToken()
  return css({
    padding: '0 4px',
    '.head': {
      padding: '15px 8px',
      marginBottom: 8,
      borderBottom: `1px solid ${colorBorderSecondary}`,
      '.title': {
        fontWeight: 600,
      },
    },
    '.ant-tree-treenode': {
      position: 'relative',
      color: colorTextSecondary,
      padding: '4px !important',
      border: '1px solid transparent',
      borderRadius: borderRadius,
      transition: '0.4s',
      zIndex: 0,
      '.actions': {
        position: 'absolute',
        right: -4,
        top: -4,
        bottom: -4,
        opacity: 0,
        padding: '0 4px',
        transition: '0.4s',
        backdropFilter: 'blur(8px)',
        '.ant-btn': {
          fontSize: 12,
          '&:hover,&.ant-dropdown-open': {
            backgroundColor: colorBgTextHover,
          },
        },
      },
      '&:hover': {
        backgroundColor: colorBgTextHover,
        '.actions': {
          opacity: 1,
        },
      },
      '&.ant-tree-treenode-selected,&:has(.ant-dropdown-open)': {
        backgroundColor: colorBgTextHover,
        '.ant-tree-node-selected': {
          color: colorText,
          backgroundColor: 'transparent !important',
        },
        '.actions': {
          opacity: 1,
        },
      },
      '.ant-tree-node-content-wrapper': {
        transition: 'unset',
        '&:hover': {
          backgroundColor: 'unset',
        },
      },
    },
    '.ant-tree-draggable-icon': {
      display: 'none',
    },
    '.ant-tree-indent-unit::before': {
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    '.ant-tree-treenode-selected': {
      color: colorText,
    },
    '.ant-tree-indent-unit:before': {
      top: -8,
      bottom: -8,
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
    },
    '.catalog-title-container': {
      display: 'flex',
      justifyContent: 'space-between',

      '&:hover .anticon': {},
    },
  })
}
