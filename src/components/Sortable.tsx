import React from 'react'
import { SortableContainer, SortableContainerProps, SortableElement } from 'react-sortable-hoc'

interface IProps<T = any> {
  value: T[]
  disabled?: boolean
  onSortEnd: (list: T[]) => void
  style?: React.CSSProperties
  renderItem: (value: T, index: number) => JSX.Element
}

export default <T extends {}>(props: IProps<T> & SortableContainerProps) => {
  const { value, onSortEnd, renderItem, disabled = false, style = {}, ...reset } = props

  const SortableItem = SortableElement(({ item, sortIndex }) => renderItem( item, sortIndex ))

  const SortableList = SortableContainer(({ value }) => {
    return (
      <div style={style}>
        {value.map((item, index) => <SortableItem disabled={disabled} key={index} item={item} sortIndex={index} index={index} />)}
      </div>
    )
  })

  return <SortableList
    {...reset}
    value={value}
    onSortEnd={({ newIndex, oldIndex }) => {
      const _value = [...value]
      const onDraged = _value.splice(oldIndex, 1)
      _value.splice(newIndex, 0, ...onDraged)
      onSortEnd(_value)
    }}
  />
}