import { css, CSSObject } from '@emotion/react'
import { theme } from 'antd'

export default function useStyle() {
  const {
    token: {
      colorBgContainer,
      colorPrimary,
      colorBorder,
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
      fontFamilyCode,
    },
  } = theme.useToken()
  const articleStyle: CSSObject = {
    '.ProseMirror-selectednode': {
      outline: 'none',
      background: colorPrimaryBg,
      borderRadius: borderRadius,
    },
    outline: 'none',
    color: colorText,
    p: {
      fontSize: '1em',
      lineHeight: 1.5,
      letterSpacing: 0.5,
      margin: '0.5em 0',
      transition: '0.4s',
      '&.empty-node': {
        color: colorTextDescription,
      },
    },
    blockquote: {
      // overflow: 'hidden',
      padding: '0 1em',
      borderLeft: `4px solid ${colorBorderSecondary}`,
      marginLeft: 0,
      marginRight: 0,
      transition: '0.4s',
    },
    h1: {
      borderBottom: `2px solid ${colorBorderSecondary}`,
      fontSize: '2em',
      lineHeight: 1,
      padding: '0 0 10px',
      margin: '15px 0',
      transition: '0.4s',
    },
    h2: {
      borderBottom: `1px solid ${colorBorderSecondary}`,
      fontSize: '1.5em',
      lineHeight: 1,
      padding: '0 0 10px',
      margin: '15px 0',
      transition: '0.4s',
    },
    h3: {
      fontSize: '1.25em',
      lineHeight: 1,
      margin: '15px 0',
      transition: '0.4s',
    },
    h4: {
      fontSize: '1.125em',
      lineHeight: 1,
      margin: '15px 0',
      transition: '0.4s',
    },
    h5: {
      fontSize: '1em',
      lineHeight: 1,
      margin: '15px 0',
      transition: '0.4s',
    },
    '.heading': {
      fontWeight: 500,
    },
    hr: {
      height: 1,
      backgroundColor: colorBgLayout,
      borderWidth: 0,
    },
    'ol,ul': {
      paddingLeft: 0,
      transition: '0.4s',
    },
    '.list-item': {
      display: 'flex',
      '.list-item_label': {
        display: 'inline-block',
        marginRight: '0.5em',
      },
    },
    li: {
      transition: '0.4s',
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
    code: {
      backgroundColor: colorBgTextHover,
      borderRadius: 3,
      paddingInline: '0.4em',
      paddingBlock: '0.2em 0.1em',
      margin: '0 0.2em',
      fontSize: 'smaller',
      border: `1px solid ${colorBorder}`,
    },

    strong: {
      fontWeight: 600,
    },

    '.tableWrapper': {
      overflow: 'unset !important',
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
      overflow: 'visible !important',
      borderRadius: borderRadius,
      transition: '0.4s',
      p: {
        lineHeight: 'unset',
      },
    },
    tr: {
      border: `1px solid ${colorBorderSecondary}`,
    },
    'td,th': {
      padding: '0 1em !important',
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
      background: colorPrimary,
      transition: '0.4s',
      width: 4,
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
    iframe: {
      width: '100%',
      border: `1px solid ${colorBorderSecondary}`,
      borderRadius: borderRadius,
      margin: '16px 0',
      transition: '0.4s',
    },
  }

  const editorStyle: CSSObject = {
    position: 'relative',
    backgroundColor: colorBgContainer,
    border: `1px solid ${colorBorderSecondary}`,
    borderRadius: borderRadius,
    '[data-tippy-root]': {
      zIndex: '99 !important',
    },
    '.milkdown': {
      padding: '16px 48px',
      minHeight: 'calc(100vh - 256px)',
      '.editor': {
        outline: 'none',
      },
    },
    '.ant-anchor': {
      fontFamily: fontFamilyCode,
    },
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
          // borderRight: 'none',
        },
        '.openCatalog': {
          "span[role='img']": {
            transform: 'rotateY(-180deg)',
          },
        },
        '.catalogWrapper': {
          width: '0 !important',
          marginLeft: 0,
          paddingLeft: '0 !important',
          // borderLeft: 'none',
        },
      },
      '.container': {
        position: 'relative',
        flex: 1,
        width: 'calc(100% - 200px)',
        height: '100%',
        padding: '0 24px 0 8px',
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
          left: -11,
          top: 10,
          transition: '0.4s',
          width: 20,
          height: 40,
          minWidth: 20,
          borderRadius: 10,
          padding: 0,
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
