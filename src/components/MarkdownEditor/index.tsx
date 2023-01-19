/** @jsxImportSource @emotion/react */
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react'
import { editorViewCtx, serializerCtx, parserCtx } from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'
import { outline } from '@milkdown/utils'
import { ReactEditor, useEditor } from '@milkdown/react'
import { Anchor, Button, Space, Spin, Tooltip } from 'antd'
import useControls, { Controls } from './hooks/useControls'
import useTheme from './hooks/useTheme'
import { RightOutlined, SaveOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { arrToTree } from '../../utils/common'
import { TranslateX, TranslateY } from '../Animation'
import editorFactory from './utils/editorFactory'
import rendererFactory from './utils/renderFactory'
import useShiki from './hooks/useShiki'
import { shikiPlugin } from './plugin/shiki'
import useStyle from './style'
import { css } from '@emotion/react'

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
  'image',
  // 'iframe',
  'hr',
  'divider',
  'clear',
  'fullScreen',
]

const MilkdownEditor = (props: IProps, ref) => {
  const { height, onChange, controls, onFinish, value = '', readonly = false, loading: contentLoading = false } = props
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  const shiki = useShiki()
  const theme = useTheme()
  const style = useStyle()

  const { editor, getDom, loading, getInstance } = useEditor(
    (root, renderReact) => {
      if (shiki) {
        return editorFactory(root, renderReact, value, readonly, onChange, setCatalog)
          .use(theme)
          .use(shikiPlugin(shiki))
      }
    },
    [readonly, value, onChange, theme, setCatalog, shiki],
  )

  const control = useControls({ editor: getInstance(), dom: getDom() })

  const getValue = () =>
    getInstance().action(ctx => {
      const editorView = ctx.get(editorViewCtx)
      const serializer = ctx.get(serializerCtx)
      return serializer(editorView.state.doc)
    })

  useImperativeHandle<any, EditorIntance>(ref, () => {
    return {
      getValue: getValue,
      setValue: markdown => {
        if (loading) return
        const editor = getInstance()
        editor?.action(ctx => {
          const view = ctx.get(editorViewCtx)
          const parser = ctx.get(parserCtx)
          const doc = parser(markdown)
          if (!doc) return
          const state = view.state
          view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)))
          setCatalog(outline()(ctx))
        })
      },
    }
  })

  useEffect(() => {
    return () => {
      getInstance()?.destroy()
    }
  }, [])

  return (
    <Spin spinning={loading || contentLoading} delay={200}>
      <div css={css([style.articleStyle, style.editorStyle])}>
        {!readonly && (
          <div className={clsx('toolBar')}>
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
        <TranslateY key={String(readonly)} delay={!readonly && (controls || defaultControls).length * 30} distance={15}>
          <div
            className={clsx('content', !showCatalog && 'hide')}
            style={{ height: typeof height === 'number' ? height + 'px' : height }}
          >
            <div className={'container'}>
              <ReactEditor editor={editor} />
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
                <Anchor affix={true} offsetTop={80}>
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
        <Anchor.Link key={item.title} href={'#' + item.title?.toLowerCase()?.replace(/\s/g, '-')} title={item.title}>
          {item.children && formatAnchor(item.children)}
        </Anchor.Link>
      ))}
    </Fragment>
  )
}

export default forwardRef(MilkdownEditor)

export function Render({ value }: { value: string }) {
  if (!value) return <></>
  const theme = useTheme()
  const { articleStyle } = useStyle()
  const { editor, getInstance } = useEditor(root => rendererFactory(root, value).use(theme), [value])
  useEffect(() => {
    return () => {
      getInstance()?.destroy()
    }
  }, [value])

  return (
    <div css={css(articleStyle)}>
      <ReactEditor editor={editor} />
    </div>
  )
}
