import { FC, useMemo, useState } from 'react'
import { Image as AntImage, Button, Card, Input } from 'antd'
import { editorViewCtx } from '@milkdown/core'
import { useNodeViewContext, useNodeViewFactory } from '@prosemirror-adapter/react'

export const Iframe: FC = () => {
  const { contentRef, node, view, setAttrs } = useNodeViewContext()
  const title = useMemo(() => node.attrs['title'], [node])
  const src = useMemo(() => node.attrs['src'], [node])
  const alt = useMemo(() => node.attrs['alt'], [node])

  console.log(node)

  return (
    <Card
      title={
        <Input
          value={src}
          size='small'
          onInput={e => {
            console.log(e)
            setAttrs({ src: e.target.value })
            // setValue(e.target.value)
          }}
          onBlur={e => {
            setAttrs({ src: e.target.value })
          }}
        />
      }
      size='small'
      type='inner'
      extra={<Button size='small'>确定</Button>}
    >
      <iframe src={src} />
      {/* <div ref={contentRef} /> */}
    </Card>
  )
}
