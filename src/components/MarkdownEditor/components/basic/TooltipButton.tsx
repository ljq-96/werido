import { Button, Tooltip, TooltipProps, theme } from 'antd'
import { ReactNode } from 'react'

export default function TooltipButton({
  title,
  icon,
  onClick,
  disabled,
  active,
  tip,
}: {
  title: string
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
    <Tooltip title={title} placement='bottom' {...tip}>
      <Button
        type='text'
        onMouseDown={onClick}
        icon={icon}
        disabled={disabled}
        style={{ background: active ? colorBgTextActive : '' }}
      />
    </Tooltip>
  )
}
