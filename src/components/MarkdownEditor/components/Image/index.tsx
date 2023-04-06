import { FC, useMemo } from 'react'
import { Image as AntImage } from 'antd'
import { editorViewCtx } from '@milkdown/core'
import { useNodeViewContext, useNodeViewFactory } from '@prosemirror-adapter/react'

export const Image: FC = () => {
  const { node, view } = useNodeViewContext()
  const title = useMemo(() => node.attrs['title'], [node])
  const src = useMemo(() => node.attrs['src'], [node])
  const alt = useMemo(() => node.attrs['alt'], [node])

  return <AntImage style={{ maxWidth: '100%' }} preview={!view.editable} src={src} alt={alt} title={title} />
}
