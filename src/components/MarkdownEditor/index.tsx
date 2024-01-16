/** @jsxImportSource @emotion/react */
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Milkdown, MilkdownProvider } from '@milkdown/react'
import { Skeleton, Spin } from 'antd'
import useStyle from './style'
import { css } from '@emotion/react'
import { editorViewCtx, editorViewOptionsCtx, parserCtx } from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import useEditor from './useEditor'
import { MenuControls } from './editorComponents/menu/menu'
import { getMarkdown } from '@milkdown/utils'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'

interface IProps {
  value?: string
  bordered?: boolean
  height?: number | string
  controls?: MenuControls[]
  readonly?: boolean
  loading?: boolean
  onReady?: () => void
  type?: 'editor' | 'render'
  upload?: {
    url?: string
  }
}

export interface EditorIntance {
  getValue: () => string
  setValue: (markdown: string) => void
}

const M = forwardRef((props: IProps, ref) => {
  const {
    bordered,
    controls,
    value,
    onReady,
    readonly = false,
    loading: contentLoading = false,
    type = 'editor',
  } = props
  const style = useStyle({ bordered })

  const { get, loading } = useEditor({ readonly, onReady, value, type })

  useImperativeHandle(ref, () => ({
    getValue: () => {
      if (loading) return
      const editor = get()
      const markdown = getMarkdown()(editor.ctx)
      return markdown
    },
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

  useEffect(() => {
    return () => {
      get()?.destroy(true)
    }
  }, [])

  return (
    <Spin spinning={loading || contentLoading}>
      <div css={css([style.articleStyle, type === 'editor' && style.editorStyle])}>
        <Milkdown />
      </div>
    </Spin>
  )
})

const MilkdownEditor = forwardRef((props: IProps, ref) => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <M {...props} ref={ref} />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  )
})

export default MilkdownEditor
