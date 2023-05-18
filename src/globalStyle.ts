import { Interpolation, Theme, css } from '@emotion/react'
import { theme } from 'antd'
import { useMemo } from 'react'

export default function useGlobalStyle(): Interpolation<Theme> {
  const { token } = theme.useToken()
  return useMemo(() => {
    const { colorTextSecondary, borderRadius, colorBgTextHover, colorText } = token
    return {
      '.catalog-tree': {
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
      },
    }
  }, [token])
}
