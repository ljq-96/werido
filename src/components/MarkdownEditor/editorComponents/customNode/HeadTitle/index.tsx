import { FC, ReactNode, useMemo } from 'react'
import { Image as AntImage, theme } from 'antd'
import { editorViewCtx } from '@milkdown/core'
import { useNodeViewContext, useNodeViewFactory } from '@prosemirror-adapter/react'

export const HeadTitle: FC = () => {
  const { contentRef, node, view } = useNodeViewContext()
  const level = useMemo(() => node.attrs['level'], [node])
  const textContent = useMemo(() => node['textContent'], [node])
  const {
    token: { colorTextTertiary },
  } = theme.useToken()

  console.log(node)

  return (
    <Head level={level} id={textContent}>
      <span style={{ color: colorTextTertiary, marginRight: 4, cursor: 'pointer' }}>
        {view.editable && new Array(level).fill('').map(() => '#')}
      </span>
      <span ref={contentRef}></span>
    </Head>
  )
}

function Head(props: { level: any; children: ReactNode; id?: string }) {
  const { level, children, id } = props
  const Tag = `h${level}` as any
  return (
    <Tag id={id} style={{ display: 'flex' }}>
      {children}
    </Tag>
  )
}
