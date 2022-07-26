import { forwardRef, Fragment, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  commandsCtx,
  Ctx,
  editorViewCtx,
  serializerCtx,
  editorViewOptionsCtx,
  editorState,
  themeManagerCtx,
} from '@milkdown/core'
// import { gfm, commonmark, image, link } from '@milkdown/preset-gfm'
import { insert, forceUpdate, replaceAll, outline } from '@milkdown/utils'
import { nord } from '@milkdown/theme-nord'
import { prism } from '@milkdown/plugin-prism'
import { history, Undo } from '@milkdown/plugin-history'
import { tooltip, tooltipPlugin } from '@milkdown/plugin-tooltip'
import { createDropdownItem, defaultActions, slash, slashPlugin } from '@milkdown/plugin-slash'
import { emoji } from '@milkdown/plugin-emoji'
import { math } from '@milkdown/plugin-math'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { cursor } from '@milkdown/plugin-cursor'
import { table } from '@milkdown/plugin-table'
import { clipboard } from '@milkdown/plugin-clipboard'
import { commonmark, image, link, codeFence } from '@milkdown/preset-commonmark'
import {} from '@milkdown/plugin-menu'
import { EditorRef, ReactEditor, useEditor, useNodeCtx } from '@milkdown/react'
import { Anchor, Button, Drawer, Space, Tooltip, Tree, TreeNodeProps } from 'antd'
import useControls, { Controls } from './hooks/useControls'
import useTheme from './hooks/useTheme'
import style from './index.module.less'
import './codeTheme/prism-one-light.css'
import { CloseOutlined, LayoutOutlined, MenuOutlined, SaveOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { arrToTree } from '../../utils/common'
import { DataNode } from 'antd/lib/tree'

interface IProps {
  height?: number | string
  value?: string
  onChange?: (v: string) => void
  controls?: Controls[]
  readonly?: boolean
  defaultValue?: string
  onFinish?: (v: string) => void
}

export interface EditorIntance {
  getValue: () => string
  setValue: (value: string) => void
}

const defaultControls: Controls[] = [
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
  'codeFence',
  'blockquote',
  'image',
  'hr',
  'divider',
  'clear',
]

const MilkdownEditor = (props: IProps, ref) => {
  const { height, onChange, controls, onFinish, defaultValue = '', readonly = false } = props
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  const editorRef = useRef<EditorRef>(null)
  const control = useControls(editorRef.current)
  const theme = useTheme()

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, defaultValue)
        ctx.set(editorViewOptionsCtx, { editable: () => !readonly })
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          // onChange?.(markdown)
          setCatalog(outline()(ctx))
        })
      })
      .use(
        commonmark
          .configure(image, {
            input: {
              placeholder: '请输入地址...',
              buttonText: '确定',
            },
          })
          .configure(link, {
            input: {
              placeholder: '请输入地址...',
              buttonText: '确定',
            },
          }),
      )
      // .use(gfm)
      .use(history)
      .use(slash)
      .use(math)
      .use(emoji)
      .use(listener)
      .use(prism)
      .use(cursor)
      .use(clipboard)
      .use(tooltip)
      .use(theme)
      .use(
        slash.configure(slashPlugin, {
          config: (ctx) => {
            return ({ content, isTopLevel }) => {
              if (!content) {
                return { placeholder: '请输入...' }
              }
              return null
            }
          },
        }),
      ),
  )

  const getValue = () =>
    editorRef.current.get().action((ctx) => {
      const editorView = ctx.get(editorViewCtx)
      const serializer = ctx.get(serializerCtx)
      return serializer(editorView.state.doc)
    })

  useImperativeHandle<any, EditorIntance>(ref, () => {
    return {
      getValue: getValue,
      setValue: (value) => {
        const ctx = editorRef.current.get().ctx
        replaceAll(value)(ctx)
        setCatalog(outline()(ctx))
      },
    }
  })

  return (
    <div className={style.markdownEditor + ' article'}>
      <div className={style.toolBar}>
        <Space wrap>
          {(controls || defaultControls).map((item, index) => (
            <Fragment key={index}>{control[item].element}</Fragment>
          ))}
          {onFinish && (
            <Tooltip title='保存' placement='bottom'>
              <Button type='text' onClick={() => onFinish(getValue())} icon={<SaveOutlined />} />
            </Tooltip>
          )}
        </Space>
        <div style={{ transition: '0.4s', transform: `translateY(${showCatalog ? 55 : 0}px)` }}>
          {showCatalog ? (
            <Tooltip key={1} title='关闭' placement='left'>
              <Button type='text' icon={<CloseOutlined />} onClick={() => setShowCatalog(false)} />
            </Tooltip>
          ) : (
            <Tooltip key={2} title='大纲' placement='bottom'>
              <Button type='text' icon={<LayoutOutlined />} onClick={() => setShowCatalog(true)} />
            </Tooltip>
          )}
        </div>
      </div>
      <div className={style.content} style={{ height: typeof height === 'number' ? height + 'px' : height }}>
        <div className={style.container}>
          <ReactEditor editor={editor} ref={editorRef} />
        </div>
        <div className={clsx(style.catalogContainer, showCatalog && style.show)}>
          <div className={style.catalogTitle}>大纲</div>
          <Anchor
            affix={true}
            onClick={(e) => e.preventDefault()}
            getContainer={() => document.querySelector('.' + style.container) as HTMLElement}>
            {formatAnchor(arrToTree(catalog))}
          </Anchor>
        </div>
      </div>
    </div>
  )
}

function formatAnchor(tree: any[]) {
  return (
    <Fragment>
      {tree.map((item) => (
        <Anchor.Link key={item.title} href={'#' + item.title} title={item.title}>
          {item.children && formatAnchor(item.children)}
        </Anchor.Link>
      ))}
    </Fragment>
  )
}

export default forwardRef(MilkdownEditor)
