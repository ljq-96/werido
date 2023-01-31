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
    '.head': {
      padding: '15px 8px',
      marginBottom: 8,
      borderBottom: `1px solid ${colorBorderSecondary}`,
      '.title': {
        fontWeight: 600,
      },
    },
    '.ant-tree-treenode': {
      color: colorTextSecondary,
      padding: '4px 0 4px 4px !important',
      // margin: '2px 0',
      border: '1px solid transparent',
      borderRadius: borderRadius,
      transition: '0.4s',
      '.catalog-add': {
        opacity: 0,
        fontSize: 12,
        width: 16,
        height: 16,
      },
      '&:hover': {
        backgroundColor: colorBgTextHover,
        '.catalog-add': {
          opacity: 1,
          transition: '0.4s',
        },
      },
      '&.ant-tree-treenode-selected': {
        backgroundColor: colorBgTextHover,
        '.ant-tree-node-selected': {
          color: colorText,
          backgroundColor: 'transparent !important',
        },
        '.catalog-add': {
          opacity: 1,
          transition: '0.4s',
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
      overflow: 'auto',
    },
    '.catalog-title-container': {
      display: 'flex',
      justifyContent: 'space-between',

      '&:hover .anticon': {},
    },
  })
}
