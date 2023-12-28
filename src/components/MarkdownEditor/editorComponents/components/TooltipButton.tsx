import { Button, Tooltip, TooltipProps, theme } from 'antd'
import { ReactNode } from 'react'

export default function TooltipButton({
  title,
  shortcut,
  icon,
  onClick,
  disabled,
  active,
  tip,
}: {
  title: string
  shortcut?: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
  tip?: TooltipProps
}) {
  const {
    token: { colorInfoActive, colorBgTextActive },
  } = theme.useToken()
  return (
    <Tooltip
      title={
        <div style={{ textAlign: 'center' }}>
          <div>{title}</div>
          {shortcut && <div style={{ fontSize: 'smaller' }}>{shortcut}</div>}
        </div>
      }
      placement='bottom'
      {...tip}
      open={disabled ? false : undefined}
    >
      <Button
        type='text'
        onClick={onClick}
        icon={icon}
        disabled={disabled}
        style={{ background: active ? colorBgTextActive : '' }}
      />
    </Tooltip>
  )
}
