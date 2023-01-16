import { Emotion, ThemeBorder, ThemeFont, ThemeManager, ThemeScrollbar, ThemeShadow, ThemeSize } from '@milkdown/core'
import { getPalette } from '@milkdown/design-system'
import { injectProsemirrorView } from '@milkdown/theme-pack-helper'
import { theme } from 'antd'

export const getStyle = (manager: ThemeManager, emotion: Emotion) => {
  const { injectGlobal, css } = emotion
  const palette = getPalette(manager)
  const {
    token: {
      borderRadius,
      colorPrimary,
      colorPrimaryBg,
      colorBgContainer,
      colorBorder,
      colorText,
      colorTextSecondary,
      colorTextTertiary,
      colorBgLayout,
      boxShadow,
    },
  } = theme.useToken()
  console.log(
    borderRadius,
    colorPrimary,
    colorPrimaryBg,
    colorBgContainer,
    colorBorder,
    colorText,
    colorTextSecondary,
    colorTextTertiary,
    colorBgLayout,
    boxShadow,
  )

  const selection = css`
    .ProseMirror-selectednode {
      outline: none;
    }

    .ProseMirror-widget {
      .icon {
        position: relative;
        color: colorText;
        z-index: 2;
      }
    }

    li.ProseMirror-selectednode {
      outline: none;
    }

    li.ProseMirror-selectednode::after {
      ${manager.get(ThemeBorder, undefined)};
    }
  `

  const editorLayout = css`
    padding: 16px;
    outline: none;
  `

  const paragraph = css`
    p {
      font-size: 1em;
      line-height: 1.5;
      letter-spacing: 0.5px;
      margin: 0;
      color: ${colorText};
    }
  `

  const blockquote = css`
    blockquote {
      padding: 1em;
      line-height: 1.75em;
      border-left: 4px solid ${colorPrimary};
      margin-left: 0;
      margin-right: 0;
      border-radius: ${borderRadius};
      background: ${palette('background')};
      /* * {
        font-size: 1em;
        line-height: 1.5em;
        margin: 0;
      } */
    }
  `

  const heading = css`
    h1 {
      border-bottom: 2px solid ${colorBorder};
      font-size: 38px;
      line-height: 1;
      padding: 0 0 10px;
      margin: 15px 0;
    }
    h2 {
      border-bottom: 1px solid ${colorBorder};
      font-size: 30px;
      line-height: 1;
      padding: 0 0 10px;
      margin: 15px 0;
    }
    h3 {
      font-size: 24px;
      line-height: 1;
      margin: 15px 0;
    }
    h4 {
      font-size: 20px;
      line-height: 1;
      margin: 15px 0;
    }
    h5 {
      font-size: 16px;
      line-height: 1;
      margin: 15px 0;
    }
    .heading {
      font-weight: 600;
    }
  `

  const hr = css`
    hr {
      height: ${manager.get(ThemeSize, 'lineWidth')};
      background-color: ${colorBgLayout};
      border-width: 0;
    }
  `

  const list = css`
    .ordered-list,
    .bullet-list {
      padding-left: 0;
    }
    .list-item {
      display: flex;
      .list-item_label {
        display: inline-block;
        margin-right: 0.5em;
      }
    }

    li {
      list-style: none;
    }

    .task-list-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      &_checkbox {
        margin: 0.5em 0.5em 0.5em 0;
        height: 1em;
      }
    }
  `

  const img = css`
    .image {
      display: inline-block;
      margin: 0 auto;
      object-fit: contain;
      width: 100%;
      position: relative;
      height: auto;
      text-align: center;
    }
  `

  const inline = css`
    .code-inline {
      background-color: ${palette('background')};
      border-radius: ${borderRadius};
      font-weight: 500;
      padding: 0 0.2em;
      margin: 0 0.2em;
      font-size: 1em;
      border: 1px solid ${colorBorder};
    }

    .strong {
      font-weight: 600;
    }

    .link,
    a {
      color: ${palette('primary')};
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      font-weight: 500;
      &:hover {
        background-color: ${palette('secondary')};
        box-shadow: 0 0.2em ${palette('secondary')}, 0 -0.2em ${palette('secondary')};
      }
    }

    .strike-through {
      /* text-decoration-color: ${palette('secondary')}; */
    }
  `

  const footnote = css`
    .footnote-definition {
      ${manager.get(ThemeBorder, undefined)};
      border-radius: ${manager.get(ThemeSize, 'radius')};
      background-color: ${palette('background')};
      padding: 1em;
      display: flex;
      flex-direction: row;
      & > .footnote-definition_content {
        flex: 1;
        width: calc(100% - 1em);
        & > dd {
          margin-inline-start: 1em;
        }
        & > dt {
          color: ${palette('secondary')};
          font-weight: 500;
        }
      }
      & > .footnote-definition_anchor {
        width: 1em;
      }
    }
  `

  const table = css`
    /* copy from https://github.com/ProseMirror/prosemirror-tables/blob/master/style/tables.css */
    .tableWrapper {
      overflow-x: auto;
      margin: 0;
      ${manager.get(ThemeScrollbar, ['x'])}
      width: 100%;
      * {
        margin: 0;
        box-sizing: border-box;
        font-size: 1em;
      }
    }
    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      overflow: auto;
      border-radius: ${manager.get(ThemeSize, 'radius')};
      p {
        line-height: unset;
      }
    }
    tr {
      ${manager.get(ThemeBorder, 'bottom')};
    }
    td,
    th {
      padding: 0 1em;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      min-width: 100px;
      ${manager.get(ThemeBorder, undefined)};
      text-align: left;
      line-height: 3;
      height: 3em;
    }
    th {
      background: ${palette('background', 0.5)};
      font-weight: 400;
    }
    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: 0;
      z-index: 20;
      pointer-events: none;
      background: ${palette('secondary')};
      width: ${manager.get(ThemeSize, 'lineWidth')};
    }
    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }

    .selectedCell {
      &::after {
        z-index: 2;
        position: absolute;
        content: '""';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: ${colorPrimaryBg};
        pointer-events: none;
      }
      p {
        position: relative;
        color: ${colorText};
        z-index: 3;
      }

      & ::selection {
        color: unset;
        background: transparent;
      }
    }
  `

  const iframe = css`
    .iframe {
      width: 100%;
      border: 1px solid ${colorBorder};
      border-radius: ${borderRadius};
      margin: 16px 0;
    }
  `

  const block = css`
    .block-handle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      color: ${colorTextTertiary};
      border-radius: 2px;
      font-size: 18px;
      transform: translateY(-2px);
      &:hover {
        color: ${colorTextSecondary};
      }
    }
    .block-menu {
      background: ${colorBgContainer};
      border: none;
      border-radius: 0;
      padding: 4px 0;
      box-shadow: ${boxShadow};
      animation: transform-y 200ms;
      .block-menu_item {
        &:hover {
          color: unset;
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
  `

  const tooltip = css`
    .tooltip,
    .tooltip-input,
    .table-tooltip {
      border: none;
      background: ${colorBgContainer};
      padding: 4px;
      box-shadow: ${boxShadow};
      animation: transform-y 200ms;
      transition: 0.4s;
      z-index: 5;
      .icon {
        width: 32px;
        height: 32px;
        color: ${colorText};
        border: none;
        &:not(:last-child) {
          margin-right: 4px;
        }
        &:hover {
          background: ${colorBgLayout};
        }
        &::after {
          display: none;
        }
        &.hide {
          display: none !important;
        }
      }
    }
    .tooltip-input {
      padding: 8px 8px 8px 16px;
      button {
        color: ${colorText};
        border-radius: ${borderRadius};
        &:hover {
          background: ${colorBgLayout};
        }
      }
    }
  `

  injectProsemirrorView(emotion)

  injectGlobal`
    .milkdown {
      .empty-node {
        white-space: nowrap;
        &::before {
          color: ${colorTextTertiary};
        }
      }
      ${manager.get(ThemeScrollbar, undefined)}
      ${selection};
      ${block};
      ${tooltip};

      .editor {
        ${editorLayout};
        ${paragraph};
        ${heading};
        ${blockquote};
        ${hr};
        ${list};
        ${img};
        ${table};
        ${footnote};
        ${inline};
        ${iframe};
      }
    }
  `
}
