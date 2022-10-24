import { Emotion, ThemeBorder, ThemeFont, ThemeManager, ThemeScrollbar, ThemeShadow, ThemeSize } from '@milkdown/core'
import { getPalette } from '@milkdown/design-system'
import { injectProsemirrorView } from '@milkdown/theme-pack-helper'

export const getStyle = (manager: ThemeManager, emotion: Emotion) => {
  const { injectGlobal, css } = emotion
  const palette = getPalette(manager)
  const radius = manager.get(ThemeSize, 'radius')
  const neutral = palette('neutral', 0.87)
  const surface = palette('surface')
  const line = palette('line')
  const highlight = palette('primary', 0.38)

  const selection = css`
    .ProseMirror-selectednode {
      outline: none;
    }

    li.ProseMirror-selectednode {
      outline: none;
    }

    li.ProseMirror-selectednode::after {
      ${manager.get(ThemeBorder, undefined)};
    }

    & ::selection {
      background: ${highlight};
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
    }
  `

  const blockquote = css`
    blockquote {
      padding: 1em;
      line-height: 1.75em;
      border-left: 4px solid ${palette('primary')};
      margin-left: 0;
      margin-right: 0;
      border-radius: ${radius};
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
      border-bottom: 2px solid #eee;
      font-size: 38px;
      line-height: 1;
      padding: 0 0 10px;
      margin: 15px 0;
    }
    h2 {
      border-bottom: 1px solid #eee;
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
      background-color: ${line};
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
      border-radius: ${radius};
      font-weight: 500;
      padding: 0 0.2em;
      margin: 0 0.2em;
      font-size: 1em;
      border: 1px solid ${line};
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
        content: '';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: ${palette('primary', 0.38)};
        pointer-events: none;
      }

      & ::selection {
        background: transparent;
      }
    }
  `

  const iframe = css`
    .iframe {
      width: 100%;
      border: 1px solid #f0f0f0;
      border-radius: ${radius};
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
      color: #7a7a7a;
      border-radius: 2px;
      font-size: 18px;
      transform: translateY(-2px);
      &:hover {
        color: #4a4a4a;
      }
    }
    .block-menu {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(5px);
      border: none;
      border-radius: 0;
      padding: 4px 0;
      box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
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
    .tooltip-input {
      border: none;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(5px);
      padding: 4px;
      box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
      animation: transform-y 200ms;
      .icon {
        width: 32px;
        height: 32px;
        color: #4a4a4a;
        border: none;
        &:not(:last-child) {
          margin-right: 4px;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        &::after {
          display: none;
        }
      }
    }
    .tooltip-input {
      padding: 8px 8px 8px 16px;
      button {
        color: #4a4a4a;
        border-radius: 2px;
        &:hover {
          background: #f5f5f5;
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
          color: #aaa;
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
