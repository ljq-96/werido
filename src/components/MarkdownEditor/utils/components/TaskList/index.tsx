import { Node } from '@milkdown/prose/model'
import { useNodeCtx } from '@milkdown/react'
import { Checkbox } from 'antd'
import { FC, ReactNode } from 'react'

export const TaskList: FC<{ children: ReactNode }> = ({ children }) => {
  const { node, view, getPos } = useNodeCtx<Node>()

  return (
    <div style={{ display: 'flex' }}>
      <Checkbox
        style={{ marginRight: 8 }}
        disabled={!view.editable}
        defaultChecked={node.attrs['checked']}
        onChange={e => {
          const { tr } = view.state
          view.dispatch(
            tr.setNodeMarkup(getPos(), undefined, {
              checked: e.target.checked,
            }),
          )
        }}
      />
      {children}
    </div>
  )
}
