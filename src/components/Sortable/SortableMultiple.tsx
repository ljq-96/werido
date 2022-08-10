import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface IProps<T> {
  value: T[]
  onChange: (value: T[]) => void
  renderItem: (val: T, index: number) => ReactElement
}

function SortableMultiple<T = any>(props: IProps<T>) {
  const { value, onChange, renderItem } = props

  const items = useMemo(() => value.map((item: any) => item._id), [value])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const SortableItem = useCallback(props => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props?.children}
      </div>
    )
  }, [])
  console.log()

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, value)}>
      {value.map((items: any, index: number) => (
        <SortableContext items={value.map((i: any) => i._id)} key={items._id} strategy={verticalListSortingStrategy}>
          {/* <SortableItem id={items._id} key={items._id}>
            <h1>{index}</h1>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={e => handleDragEnd(e, items.children)}
              onDragOver={e => {
                console.log(e)
              }}
            > */}
          <SortableContext
            items={items.children.map(i => i._id)}
            key={items._id}
            strategy={verticalListSortingStrategy}
          >
            {items.children.map((item: any, index) => (
              <SortableItem id={item._id} key={item._id}>
                {renderItem(item, index)}
              </SortableItem>
            ))}
          </SortableContext>
          {/* </DndContext>
          </SortableItem> */}
        </SortableContext>
      ))}
    </DndContext>
  )

  function handleDragEnd(event, value) {
    console.log(value)

    const { active, over } = event
    const oldIndex = items.indexOf(active.id)
    const newIndex = items.indexOf(over.id)
    onChange(arrayMove(value, oldIndex, newIndex))
  }
}

export default SortableMultiple
