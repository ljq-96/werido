import { Cascader, CascaderProps } from 'antd'
import options from './cities.json'
export default function CityCascader({
  value,
  onChange,
  ...props
}: CascaderProps<any> & {
  value?: any
  onChange?: any
}) {
  return <Cascader {...(props as any)} value={value} options={options} onChange={e => onChange?.(e)} />
}
