import { useNodeCtx } from '@milkdown/react'
import { FC } from 'react'
import { Image as AntImage } from 'antd'
import { editorViewCtx } from '@milkdown/core'

export const Image: FC = () => {
  const { node, ctx } = useNodeCtx()

  return (
    <AntImage
      preview={!ctx.get(editorViewCtx).editable}
      src={node.attrs['src']}
      alt={node.attrs['alt']}
      title={node.attrs['tittle']}
    />
  )
}
