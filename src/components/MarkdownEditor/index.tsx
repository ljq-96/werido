import { forwardRef, Fragment, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Editor, rootCtx, defaultValueCtx, editorViewCtx, serializerCtx, editorViewOptionsCtx } from '@milkdown/core'
import { gfm, commonmark, image, link } from '@milkdown/preset-gfm'
import { replaceAll, outline, forceUpdate, getHTML } from '@milkdown/utils'
import { prism } from '@milkdown/plugin-prism'
import { history, Undo } from '@milkdown/plugin-history'
import { tooltip, tooltipPlugin } from '@milkdown/plugin-tooltip'
import { createDropdownItem, defaultActions, slash, slashPlugin } from '@milkdown/plugin-slash'
import { emoji } from '@milkdown/plugin-emoji'
import { math } from '@milkdown/plugin-math'
import { block } from '@milkdown/plugin-block'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { cursor } from '@milkdown/plugin-cursor'
import { clipboard } from '@milkdown/plugin-clipboard'
import { indent, indentPlugin } from '@milkdown/plugin-indent'
import { iframePlugin } from './plugin/iframe'
import {} from '@milkdown/plugin-menu'
import { nord } from '@milkdown/theme-nord'
import { EditorRef, ReactEditor, useEditor, useNodeCtx } from '@milkdown/react'
import { Anchor, Button, Drawer, Space, Spin, Tooltip, Tree, TreeNodeProps } from 'antd'
import useControls, { Controls } from './hooks/useControls'
import useTheme from './hooks/useTheme'
import style from './index.module.less'
import './codeTheme/prism-one-light.css'
import { RightOutlined, SaveOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { arrToTree } from '../../utils/common'
import { DataNode } from 'antd/lib/tree'
import { TranslateX, TranslateY } from '../Animation'

interface IProps {
  height?: number | string
  value?: string
  onChange?: (v: string) => void
  controls?: Controls[]
  readonly?: boolean
  defaultValue?: string
  onFinish?: (v: string) => void
  loading?: boolean
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
  'iframe',
  'hr',
  'divider',
  'clear',
]

const MilkdownEditor = (props: IProps, ref) => {
  const {
    height,
    onChange,
    controls,
    onFinish,
    defaultValue = '',
    readonly = false,
    loading: contentLoading = false,
  } = props
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  // const editorRef = useRef<EditorRef>(null)
  const theme = useTheme()

  const { editor, getInstance, getDom, loading } = useEditor(
    root =>
      Editor.make()
        .config(ctx => {
          ctx.set(rootCtx, root)
          ctx.set(editorViewOptionsCtx, { editable: () => !readonly })
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
            // onChange?.(markdown)
            setCatalog(outline()(ctx))
          })
        })
        .use(
          gfm
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
        .use(history)
        .use(math)
        .use(emoji)
        .use(listener)
        .use(prism)
        .use(cursor)
        .use(clipboard)
        .use(tooltip)
        // .use(block)
        .use(theme)
        .use(iframePlugin)
        .use(
          slash.configure(slashPlugin, {
            config: ctx => {
              return ({ content, isTopLevel }) => {
                if (!content) {
                  return { placeholder: '请输入...' }
                }
                return null
              }
            },
          }),
        )
        .use(
          indent.configure(indentPlugin, {
            type: 'space',
            size: 4,
          }),
        ),
    [readonly, setCatalog],
  )

  const control = useControls({ editor: getInstance(), dom: getDom() })

  const getValue = () =>
    getInstance().action(ctx => {
      const editorView = ctx.get(editorViewCtx)
      const serializer = ctx.get(serializerCtx)
      return serializer(editorView.state.doc)
    })

  useEffect(() => {
    const editor = getInstance()
    if (editor) {
      const value = getValue()
      editor?.action(forceUpdate)
      setTimeout(() => {
        getInstance()?.action(replaceAll(value))
      })
    }
  }, [readonly])

  useImperativeHandle<any, EditorIntance>(ref, () => {
    return {
      getValue: getValue,
      setValue: value => {
        const ctx = getInstance().ctx
        replaceAll(value)(ctx)
        setCatalog(outline()(ctx))
        editor.editor.current.action(ctx => {
          replaceAll(value)(ctx)
          setCatalog(outline()(ctx))
        })
      },
    }
  })

  return (
    <Spin spinning={loading || contentLoading} delay={200}>
      <div className={style.markdownEditor + ' article'}>
        {!readonly && (
          <div className={style.toolBar}>
            <Space wrap>
              {(controls || defaultControls).map((item, index) => (
                <TranslateX key={index} delay={index * 30}>
                  {control[item].element}
                </TranslateX>
              ))}
              {onFinish && (
                <Tooltip title='保存' placement='bottom'>
                  <Button type='text' onClick={() => onFinish(getValue())} icon={<SaveOutlined />} />
                </Tooltip>
              )}
            </Space>
            <div></div>
          </div>
        )}
        <TranslateY key={String(readonly)} delay={(controls || defaultControls).length * 30} distance={15}>
          <div
            className={clsx(style.content, !showCatalog && style.hide)}
            style={{ height: typeof height === 'number' ? height + 'px' : height }}
          >
            <div className={style.container}>
              <ReactEditor editor={editor} />
            </div>
            <div className={style.catalogContainer} style={{ top: readonly ? -16 : 32 }}>
              <Tooltip title={!showCatalog && '展开'} placement='left'>
                <Button
                  className={style.openCatalog}
                  shape='circle'
                  icon={<RightOutlined />}
                  onClick={() => setShowCatalog(!showCatalog)}
                />
              </Tooltip>

              <div className={style.catalogWrapper}>
                <div className={style.catalogTitle}>大纲</div>
                <Anchor
                  affix={true}
                  onClick={e => e.preventDefault()}
                  getContainer={() => document.getElementById('content')}
                >
                  {formatAnchor(arrToTree(catalog))}
                </Anchor>
              </div>
            </div>
          </div>
        </TranslateY>
      </div>
    </Spin>
  )
}

function formatAnchor(tree: any[]) {
  return (
    <Fragment>
      {tree.map(item => (
        <Anchor.Link key={item.title} href={'#' + item.title} title={item.title}>
          {item.children && formatAnchor(item.children)}
        </Anchor.Link>
      ))}
    </Fragment>
  )
}

export default forwardRef(MilkdownEditor)

export function Render({ value }: { value: string }) {
  const theme = useTheme()
  const dom = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      Editor.make()
        .config(ctx => {
          ctx.set(rootCtx, dom.current)
          ctx.set(defaultValueCtx, value)
          ctx.set(editorViewOptionsCtx, { editable: () => false })
        })
        .use(gfm)
        .use(emoji)
        .use(prism)
        .use(iframePlugin)
        .use(slash)
        .use(theme)
        .create()
    })
  }, [dom])

  return <div ref={dom}></div>
}
