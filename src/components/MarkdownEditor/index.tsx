/** @jsxImportSource @emotion/react */
import { forwardRef, Fragment, memo, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { Milkdown, MilkdownProvider } from '@milkdown/react'
import { Anchor, Button, Space, Spin, Tooltip } from 'antd'
import useControls, { Controls } from './hooks/useControls'
import { RightOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { arrToTree } from '../../utils/common'
import { TranslateX, TranslateY } from '../Animation'
import useStyle from './style'
import { css } from '@emotion/react'
import {
  ProsemirrorAdapterProvider,
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from '@prosemirror-adapter/react'
import useMyEditor from './hooks/useMyEditor'
import { editorView, editorViewCtx, parserCtx } from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'

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

const MilkdownEditor = (props: IProps) => {
  const { height, onChange, controls, onFinish, value = '', readonly = false, loading: contentLoading = false } = props
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  const pluginViewFactory = usePluginViewFactory()
  const nodeViewFactory = useNodeViewFactory()
  const widgetViewFactory = useWidgetViewFactory()
  const style = useStyle()
  const control = useControls(controls || defaultControls)

  const { get, loading } = useMyEditor({ value, onChange, readonly })

  useEffect(() => {
    return () => {
      get()?.destroy()
    }
  }, [])

  // useImperativeHandle(ref, () => ({
  //   // getValue: () => get()?.getValue() || '',
  //   setValue: (markdown: string) => {
  //     if (loading) return
  //     const editor = get()
  //     editor?.action(ctx => {
  //       const view = ctx.get(editorViewCtx)
  //       const parser = ctx.get(parserCtx)
  //       const doc = parser(markdown)
  //       if (!doc) return
  //       const state = view.state
  //       view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)))
  //     })
  //   },
  // }))

  return (
    <Spin spinning={loading || contentLoading} delay={200}>
      <div css={css([style.articleStyle, style.editorStyle])}>
        <Milkdown />
        {/* {!readonly && (
          <div className={clsx('toolBar')}>
            <Meun controls={controls || defaultControls} />
            <div></div>
          </div>
        )} */}
        {/* <TranslateY key={String(readonly)} delay={!readonly && (controls || defaultControls).length * 30} distance={15}>
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
        </TranslateY> */}
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

export const Render = memo(
  forwardRef(({ value }: { value: string }, ref) => {
    if (!value) return <></>
    const { articleStyle } = useStyle()

    const { loading, get } = useMyEditor({ value, readonly: true })
    useEffect(() => {
      return () => {
        if (loading) return
        get()?.destroy()
      }
    }, [])

    useImperativeHandle(ref, () => ({
      // getValue: () => get()?.getValue() || '',
      setValue: (markdown: string) => {
        if (loading) return
        const editor = get()
        editor?.action(ctx => {
          const view = ctx.get(editorViewCtx)
          const parser = ctx.get(parserCtx)
          const doc = parser(markdown)
          if (!doc) return
          const state = view.state
          view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)))
        })
      },
    }))

    return (
      <div css={css(articleStyle)}>
        <Milkdown />
      </div>
    )
  }),
  (prev, next) => prev.value === next.value,
)

// export function Render({ value }: { value: string }) {
//   return (
//     <MilkdownProvider>
//       <ProsemirrorAdapterProvider>
//         <RenderFn value={value} />
//       </ProsemirrorAdapterProvider>
//     </MilkdownProvider>
//   )
// }
