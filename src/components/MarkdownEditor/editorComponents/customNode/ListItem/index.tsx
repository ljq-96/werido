/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { Checkbox, theme } from 'antd'
import type { FC } from 'react'

export const ListItem: FC = () => {
  const { contentRef, node, setAttrs, selected } = useNodeViewContext()
  const { attrs } = node
  const checked = attrs?.checked
  const isBullet = attrs?.listType === 'bullet'
  const {
    token: { colorText },
  } = theme.useToken()
  return (
    <li
      css={css({
        display: 'flex',
        '.dot-container': {
          margin: '0.5em 0.5em 0.5em 0',
        },
        '.bullet-dot': {
          width: '0.5em',
          height: '0.5em',
          margin: '0.5em 0',
          borderRadius: '50%',
          backgroundColor: colorText,
        },
      })}
    >
      <div className='dot-container'>
        {checked != null ? (
          <Checkbox onChange={e => setAttrs({ checked: e.target.checked })} checked={checked} />
        ) : isBullet ? (
          <div className='bullet-dot' />
        ) : (
          <div>{attrs?.label}</div>
        )}
      </div>
      <div ref={contentRef} />
    </li>
  )
}
