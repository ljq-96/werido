/** @jsxImportSource @emotion/react */
import { forwardRef, Fragment, useContext, useEffect, useImperativeHandle, useState } from 'react'
import {
  editorViewCtx,
  serializerCtx,
  parserCtx,
  Editor,
  rootCtx,
  defaultValueCtx,
  editorViewOptionsCtx,
} from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'
import { $view, outline } from '@milkdown/utils'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { Anchor, Button, ConfigProvider, Space, Spin, Tooltip } from 'antd'
import useControls, { Controls } from './hooks/useControls'
import { RightOutlined, SaveOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { arrToTree } from '../../utils/common'
import { TranslateX, TranslateY } from '../Animation'
import rendererFactory from './utils/renderFactory'
import { shiki } from './plugins/shiki'
import useStyle from './style'
import { css } from '@emotion/react'
import { nord } from '@milkdown/theme-nord'
import { codeBlockSchema, commonmark, imageSchema, listItemSchema } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { tooltip, TooltipView } from './components/Tooltip'
import { useNodeViewFactory, usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/react'
import { block } from '@milkdown/plugin-block'
import { BlockView } from './components/Block'
import { diagram, diagramSchema } from '@milkdown/plugin-diagram'
import { CodeBlock } from './components/CodeBlock'
import { ImageTooltip, imageTooltip } from './components/ImageTooltip'
import { Diagram } from './components/Diagram'
import { Image } from './components/Image'
import { ListItem } from './components/ListItem'
import { linkPlugin } from './components/LinkWidget'
import { tableSelectorPlugin, TableTooltip, tableTooltip, tableTooltipCtx } from './components/TableWidget'
import { Ctx } from '@milkdown/ctx'
import { indent } from '@milkdown/plugin-indent'
import { history } from '@milkdown/plugin-history'
import { iframe, iframeSchema } from './plugins/iframe'
import { Iframe } from './components/Iframe'
import { clipboard } from '@milkdown/plugin-clipboard'
import useMyEditor from './hooks/useMyEditor'

interface IProps {
  height?: number | string
  value?: string
  onChange?: (v: string) => void
  controls?: Controls[]
  readonly?: boolean
  onFinish?: (v: string) => void
  loading?: boolean
}

export interface EditorIntance {
  getValue: () => string
  setValue: (markdown: string) => void
}

const defaultControls: Controls[] = [
  'more',
  'divider',
  'undo',
  'text',
  'blod',
  'italic',
  'strikeThrough',
  'link',
  'divider',
  'bulletList',
  'orderedList',
  'taskList',
  'divider',
  'inlineCode',
  // 'codeFence',
  // 'blockquote',
  'table',
  'image',
  // 'iframe',
  'hr',
  'divider',
  'clear',
  'fullScreen',
]

const markdown = `# Milkdown React Block
> You're scared of a world where you're needed.
This is a demo for using Milkdown with **React**.
Hover the cursor on the editor to see the block handle.

::iframe{src="https://saul-mirone.github.io"}

| First Header   |    Second Header   |
| -------------- | :----------------: |
| Content Cell 1 |  \`Content\` Cell 1  |
| Content Cell 2 | **Content** Cell 2 |

我是一段文字
![greeting bear](https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png)

\`\`\`javascript
const a = 10;
console.log(a);
\`\`\`

*   Features
    *   [x] 📝 **WYSIWYG Markdown** - Write markdown in an elegant way
    *   [x] 🎨 **Themable** - Theme can be shared and used with npm packages
    *   [x] 🎮 **Hackable** - Support your awesome idea by plugin
    *   [x] 🦾 **Reliable** - Built on top of [prosemirror](https://prosemirror.net/) and [remark](https://github.com/remarkjs/remark)
    *   [x] ⚡ **Slash & Tooltip** - Write fast for everyone, driven by plugin
    *   [x] 🧮 **Math** - LaTeX math equations support, driven by plugin
    *   [x] 📊 **Table** - Table support with fluent ui, driven by plugin
    *   [x] 📰 **Diagram** - Diagram support with [mermaid](https://mermaid-js.github.io/mermaid/#/), driven by plugin
    *   [x] 🍻 **Collaborate** - Shared editing support with [yjs](https://docs.yjs.dev/), driven by plugin
    *   [x] 💾 **Clipboard** - Support copy and paste markdown, driven by plugin
    *   [x] 👍 **Emoji** - Support emoji shortcut and picker, driven by plugin
*   Made by
    1.   Programmer: [Mirone](https://github.com/Milkdown)
    2.   Designer: [Mirone](https://github.com/Milkdown)

\`\`\`mermaid
graph TD;
EditorState-->EditorView;
EditorView-->DOMEvent;
DOMEvent-->Transaction;
Transaction-->EditorState;
\`\`\`
`

const MilkdownEditor = (props: IProps, ref) => {
  const { height, onChange, controls, onFinish, value = '', readonly = false, loading: contentLoading = false } = props
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  const pluginViewFactory = usePluginViewFactory()
  const nodeViewFactory = useNodeViewFactory()
  const widgetViewFactory = useWidgetViewFactory()
  const style = useStyle()
  const control = useControls(controls || defaultControls)

  const { get, loading } = useMyEditor({ value, onChange })

  useEffect(() => {
    return () => {
      get()?.destroy()
    }
  }, [])

  return (
    <Spin spinning={loading || contentLoading} delay={200}>
      <div css={css([style.articleStyle, style.editorStyle])}>
        {!readonly && (
          <div className={clsx('toolBar')}>
            <Space wrap>
              {control.map((item, index) => (
                <TranslateX key={index} delay={index * 30}>
                  {item}
                </TranslateX>
              ))}
              {/* {onFinish && (
                <Tooltip title='保存' placement='bottom'>
                  <Button type='text' onClick={() => onFinish(getValue())} icon={<SaveOutlined />} />
                </Tooltip>
              )} */}
            </Space>
            <div></div>
          </div>
        )}
        <TranslateY key={String(readonly)} delay={!readonly && (controls || defaultControls).length * 30} distance={15}>
          <div
            className={clsx('content', !showCatalog && 'hide')}
            style={{ height: typeof height === 'number' ? height + 'px' : height }}
          >
            <div className={'container'}>
              <Milkdown />
            </div>
            <div className={'catalogContainer'} style={{ top: readonly ? 56 : 104 }}>
              <Button
                className={'openCatalog'}
                shape='circle'
                icon={<RightOutlined />}
                onClick={() => setShowCatalog(!showCatalog)}
              />
              <div className={'catalogWrapper'}>
                <div className={'catalogTitle'}>大纲</div>
                <Anchor affix={true} offsetTop={80} items={formatAnchor(arrToTree(catalog))} />
              </div>
            </div>
          </div>
        </TranslateY>
      </div>
    </Spin>
  )
}

export default MilkdownEditor

const formatAnchor = (tree: any[]) =>
  tree.map(item => ({
    href: '#' + item.title?.toLowerCase()?.replace(/\s/g, '-'),
    title: item.title,
    children: item.children && formatAnchor(item.children),
  }))

export function Render({ value }: { value: string }) {
  if (!value) return <></>
  const { articleStyle } = useStyle()
  const { get } = useMyEditor({ value, readonly: true })
  useEffect(() => {
    return () => {
      get()?.destroy()
    }
  }, [value])

  console.log(value)

  return (
    <div css={css(articleStyle)}>
      <Milkdown />
    </div>
  )
}
