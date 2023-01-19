import { css, CSSObject } from '@emotion/react'
import { theme } from 'antd'

export default function useStyle() {
  const {
    token: {
      colorBgContainer,
      colorPrimary,
      colorBorderSecondary,
      borderRadius,
      colorText,
      colorBgLayout,
      colorBgElevated,
      colorPrimaryBg,
      boxShadowSecondary,
      colorTextSecondary,
      colorTextTertiary,
      colorBgTextHover,
      colorTextDescription,
    },
  } = theme.useToken()
  const articleStyle: CSSObject = {
    '.ProseMirror-selectednode': {
      outline: 'none',
    },
    outline: 'none',
    color: colorText,
    p: {
      fontSize: '1em',
      lineHeight: 1.5,
      letterSpacing: 0.5,
      margin: 0,
      '&.empty-node': {
        color: colorTextDescription,
      },
    },
    blockquote: {
      padding: '1em',
      lineHeight: '1.75em',
      borderLeft: `4px solid ${colorPrimary}`,
      marginLeft: 0,
      marginRight: 0,
      borderRadius: borderRadius,
      background: colorBgLayout,
    },
    h1: {
      borderBottom: `2px solid ${colorBorderSecondary}`,
      fontSize: 38,
      lineHeight: 1,
      padding: '0 0 10px',
      margin: '15px 0',
    },
    h2: {
      borderBottom: `1px solid ${colorBorderSecondary}`,
      fontSize: 30,
      lineHeight: 1,
      padding: '0 0 10px',
      margin: '15px 0',
    },
    h3: {
      fontSize: 24,
      lineHeight: 1,
      margin: '15px 0',
    },
    h4: {
      fontSize: 20,
      lineHeight: 1,
      margin: '15px 0',
    },
    h5: {
      fontSize: 16,
      lineHeight: 1,
      margin: '15px 0',
    },
    '.heading': {
      fontWeight: 600,
    },
    hr: {
      height: 1,
      backgroundColor: colorBgLayout,
      borderWidth: 0,
    },
    '.ordered-list,.bullet-list': {
      paddingLeft: 0,
    },
    '.list-item': {
      display: 'flex',
      '.list-item_label': {
        display: 'inline-block',
        marginRight: '0.5em',
      },
    },

    li: {
      listStyle: 'none',
    },

    '.task-list-item': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      '&_checkbox': {
        margin: '0.5em 0.5em 0.5em 0',
        height: '1em',
      },
    },
    '.image': {
      display: 'inline-block',
      margin: '0 auto',
      objectFit: 'contain',
      width: '100%',
      position: 'relative',
      height: 'auto',
      textAlign: 'center',
    },
    '.code-inline': {
      backgroundColor: colorBgTextHover,
      borderRadius: borderRadius,
      padding: '0 0.2em',
      margin: '0 0.2em',
      fontSize: '1em',
      border: `1px solid ${colorBorderSecondary}`,
    },

    '.strong': {
      fontWeight: 600,
    },

    '.link': {
      color: colorPrimary,
      cursor: 'pointer',
      transition: 'all 0.4s ease-in-out',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: colorPrimaryBg,
        boxShadow: `0 0.2em ${colorPrimaryBg}, 0 -0.2em ${colorPrimaryBg}`,
      },
    },
    '.tableWrapper': {
      overflowX: 'auto',
      margin: 0,
      width: '100%',
      '*': {
        margin: 0,
        boxSizing: 'border-box',
        fontSize: '1em',
      },
    },
    table: {
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      width: '100%',
      overflow: 'auto',
      borderRadius: borderRadius,
      p: {
        lineHeight: 'unset',
      },
    },
    tr: {
      border: `1px solid ${colorBorderSecondary}`,
    },
    'td,th': {
      padding: '0 1em',
      verticalAlign: 'top',
      boxSizing: 'border-box',
      position: 'relative',

      minWidth: 100,
      border: `1px solid ${colorBorderSecondary}`,
      textAlign: 'left',
      lineHeight: 3,
      height: '3em',
    },
    th: {
      background: colorBgLayout,
      fontWeight: 400,
    },
    '.column-resize-handle': {
      position: 'absolute',
      right: -2,
      top: 0,
      bottom: 0,
      zIndex: 20,
      pointerEvents: 'none',
      background: colorPrimaryBg,
      width: 1,
    },
    '.resize-cursor': {
      cursor: 'col-resize',
    },

    '.selectedCell': {
      '&::after': {
        zIndex: 2,
        position: 'absolute',
        content: '""',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: colorPrimaryBg,
        pointerEvents: 'none',
      },
      p: {
        position: 'relative',
        color: colorText,
        zIndex: 3,
      },

      '&::selection': {
        color: 'unset',
        background: 'transparent',
      },
    },
    '.iframe': {
      width: '100%',
      border: `1px solid ${colorBorderSecondary}`,
      borderRadius: borderRadius,
      margin: '16px 0',
    },
    '.block-handle': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      color: colorTextTertiary,
      backgroundColor: colorBgLayout,
      borderRadius: '50%',
      border: `1px solid ${colorBorderSecondary}`,
      fontSize: 16,
      transform: 'translateY(-2px)',
      cursor: 'pointer',
      '&:hover': {
        color: colorPrimary,
        backgroundColor: colorPrimaryBg,
      },
    },
    '.block-menu': {
      background: colorBgElevated,
      border: 'none',
      borderRadius: borderRadius,
      padding: '0 4px',
      boxShadow: boxShadowSecondary,
      marginTop: 16,
      animation: 'transform-y 200ms',

      '.block-menu_item': {
        color: colorTextSecondary,
        borderRadius: borderRadius,
        margin: '4px 0',
        '&:hover': {
          color: colorText,
          background: colorBgTextHover,
        },
      },
    },
    '.tooltip,.tooltip-input,.table-tooltip': {
      border: 'none',
      background: colorBgElevated,
      padding: 4,
      borderRadius: borderRadius,
      boxShadow: boxShadowSecondary,
      animation: 'transform-y 200ms',
      transition: '0.2s',
      zIndex: 5,
      '.icon': {
        width: 32,
        height: 32,
        color: colorText,
        border: 'none',
        borderRadius: borderRadius,
        '&:not(:last-child)': {
          marginRight: 4,
        },
        '&:hover': {
          background: colorBgLayout,
        },
        '&::after': {
          display: 'none',
        },
        '&.hide': {
          display: 'none !important',
        },
      },
    },
    '.tooltip-input': {
      padding: '8px 8px 8px 16px',
      borderRadius: borderRadius,
      background: colorBgElevated,
      button: {
        color: colorText,
        borderRadius: borderRadius,
        '&:hover': {
          background: colorBgLayout,
        },
      },
    },
  }

  const editorStyle: CSSObject = {
    position: 'relative',
    backgroundColor: colorBgContainer,
    border: `1px solid ${colorBorderSecondary}`,
    borderRadius: borderRadius,
    '.toolBar': {
      position: 'sticky',
      top: 56,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 16px',
      borderBottom: `1px solid ${colorBorderSecondary}`,
      backgroundColor: colorBgContainer,
      zIndex: 9,
      borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
      '.ant-btn.active': {
        backgroundColor: colorBgLayout,
      },
    },
    '.content': {
      display: 'flex',
      alignItems: 'stretch',
      padding: '16px 32px',
      '&.hide': {
        '.container': {
          flex: 1,
          borderRight: 'none',
        },
        '.openCatalog': {
          left: -16,
          borderRight: 0,
          borderRadius: `32px 0 0 32px`,
          "span[role='img']": {
            transform: 'rotateY(-180deg)',
          },
        },
        '.catalogWrapper': {
          width: '0 !important',
          marginLeft: 0,
          paddingLeft: '0 !important',
          borderLeft: 'none',
        },
      },
      '.container': {
        position: 'relative',
        flex: 1,
        width: 'calc(100% - 200px)',
        height: '100%',
        padding: '0 8px',
        minHeight: 300,
        borderRight: `1px solid ${colorBorderSecondary}`,
      },
      '.catalogContainer': {
        position: 'sticky',
        top: 104,
        height: '100%',
        flex: 0,
        '.openCatalog': {
          position: 'absolute',
          left: -16,
          top: 12,
          transition: '0.4s',
          "span[role='img']": {
            transition: 'transform 0.4s 0.4s',
          },
        },
        '.catalogWrapper': {
          paddingTop: 16,
          paddingLeft: 16,
          width: 200,
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: '0.4s',
        },
        '.catalogTitle': {
          fontSize: 16,
          color: colorText,
          paddingBottom: 16,
          marginBottom: 16,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
        ':global': {
          '.ant-tree-show-line .ant-tree-switcher': {
            backgroundColor: 'transparent',
          },
        },
      },
      '.ProseMirror-focused': {
        outline: 'none',
      },
    },
  }
  return { articleStyle, editorStyle }
}
