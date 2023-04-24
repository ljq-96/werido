/** @jsxImportSource @emotion/react */
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react'
import { Milkdown } from '@milkdown/react'
import { Spin } from 'antd'
import useStyle from './style'
import { css } from '@emotion/react'
import useMyEditor from './hooks/useMyEditor'
import { editorViewCtx, parserCtx } from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import { MenuControls } from './plugins/menu'

interface IProps {
  height?: number | string
  value?: string
  onChange?: (v: string) => void
  controls?: MenuControls[]
  readonly?: boolean
  onFinish?: (v: string) => void
  loading?: boolean
}

export interface EditorIntance {
  getValue: () => string
  setValue: (markdown: string) => void
}

const MilkdownEditor = (props: IProps) => {
  const { height, onChange, controls, onFinish, value = '', readonly = false, loading: contentLoading = false } = props
  const style = useStyle()

  const { get, loading } = useMyEditor({ value, onChange, readonly })

  useEffect(() => {
    return () => {
      get()?.destroy()
    }
  }, [])

  return (
    <Spin spinning={loading || contentLoading} delay={200}>
      <div css={css([style.articleStyle, style.editorStyle])}>
        <Milkdown />
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

    const { loading, get } = useMyEditor({ value, readonly: true, type: 'render' })
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
