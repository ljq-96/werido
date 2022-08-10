import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

interface IProps<T> {
  value: T[]
  onChange: (value: T[]) => void
  renderItem: (val: T, index: number, attrs: any) => ReactElement
}

function SortableContainer<T = any>(props: IProps<T>) {
  const { value, onChange, renderItem } = props

  const items = useMemo(() => value.map((item: any) => item._id), [value])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const SortableItem = useCallback(
    props => {
      const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      }

      return renderItem ? (
        renderItem(props.item, props.index, { ref: setNodeRef, style, ...attributes, ...listeners })
      ) : (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}></div>
      )
    },
    [renderItem],
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {value.map((item: any, index) => (
          <SortableItem id={item._id} key={item._id} item={item} index={index}></SortableItem>
        ))}
        <input onKeyUp={e => e.preventDefault} />
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    const { active, over } = event
    const oldIndex = items.indexOf(active.id)
    const newIndex = items.indexOf(over.id)
    onChange(arrayMove(value, oldIndex, newIndex))
  }
}

export default SortableContainer
