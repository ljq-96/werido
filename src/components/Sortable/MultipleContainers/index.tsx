import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  AnimateLayoutChanges,
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates'

import { Item, Container, ContainerProps } from '../components'
import { IBookmark } from '../../../../types'

export default {
  title: 'Presets/Sortable/Multiple Containers',
}

const animateLayoutChanges: AnimateLayoutChanges = args => defaultAnimateLayoutChanges({ ...args, wasDragging: true })

function DroppableContainer({
  children,
  columns = 1,
  id,
  items,
  style,
  ...props
}: ContainerProps & {
  disabled?: boolean
  id: UniqueIdentifier
  items: UniqueIdentifier[]
  style?: React.CSSProperties
}) {
  const { active, attributes, isDragging, listeners, over, setNodeRef, transition, transform } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  })
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') || items.includes(over.id)
    : false

  return (
    <Container
      ref={props.disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  )
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>

interface Props {
  value: IBookmark[]
  onChange: (value: IBookmark[]) => void
  disabled?: boolean
  containerDisabled?: boolean
  adjustScale?: boolean
  cancelDrop?: CancelDrop
  columns?: number
  containerStyle?: React.CSSProperties
  coordinateGetter?: KeyboardCoordinateGetter
  getItemStyles?(args: {
    value: UniqueIdentifier
    index: number
    overIndex: number
    isDragging: boolean
    containerId: UniqueIdentifier
    isSorting: boolean
    isDragOverlay: boolean
  }): React.CSSProperties
  wrapperStyle?(args: { index: number }): React.CSSProperties
  items?: Items
  handle?: boolean
  renderItem?: any
  renderTitle?: (title: string, index: number) => ReactNode
  strategy?: SortingStrategy
  modifiers?: Modifiers
  minimal?: boolean
  trashable?: boolean
  scrollable?: boolean
  vertical?: boolean
  gray?: boolean
}

export function MultipleContainers({
  value,
  onChange,
  disabled,
  containerDisabled,
  adjustScale = false,
  columns,
  handle = false,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  renderTitle,
  strategy = verticalListSortingStrategy,
  vertical = false,
  scrollable,
  gray = true,
}: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const items = useMemo<{ [key: UniqueIdentifier]: UniqueIdentifier[] }>(() => {
    return value.reduce((prev, next) => {
      prev[next._id] = next.children.map(item => item._id)
      return prev
    }, {})
  }, [value])

  const itemMap = useMemo(() => {
    const res: any = {}
    value.forEach(k => {
      res[k._id] = k
      k.children.forEach(v => (res[v._id] = v))
    })
    return res
  }, [value])

  const containers = useMemo(() => Object.keys(items) as UniqueIdentifier[], [items])
  const isSortingContainer = activeId ? containers.includes(activeId) : false

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    args => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => container.id in items),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId]
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                container => container.id !== overId && containerItems.includes(container.id),
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, items],
  )
  const [clonedItems, setClonedItems] = useState<Items | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  )
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find(key => items[key].includes(id))
  }

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = items[container].indexOf(id)

    return index
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [items])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id)
        setClonedItems(items)
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id

        if (overId == null || active.id in items) {
          return
        }

        const overContainer = findContainer(overId)
        const activeContainer = findContainer(active.id)

        if (!overContainer || !activeContainer) {
          return
        }

        if (activeContainer !== overContainer) {
          const activeItems = items[activeContainer]
          const overItems = items[overContainer]
          const overIndex = overItems.indexOf(overId)
          const activeIndex = activeItems.indexOf(active.id)

          let newIndex: number

          if (overId in items) {
            newIndex = overItems.length + 1
          } else {
            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top > over.rect.top + over.rect.height

            const modifier = isBelowOverItem ? 1 : 0

            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
          }

          recentlyMovedToNewContainer.current = true
          onChange(
            containers.map(k => {
              if (k === activeContainer) {
                return {
                  ...itemMap[k],
                  children: items[activeContainer].filter(item => item !== active.id).map(v => itemMap[v]),
                }
              } else if (k === overContainer) {
                return {
                  ...itemMap[k],
                  children: [
                    ...items[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...items[overContainer].slice(newIndex, items[overContainer].length),
                  ].map(v => itemMap[v]),
                }
              } else {
                return {
                  ...itemMap[k],
                  children: items[k].map(v => itemMap[v]),
                }
              }
            }),
          )
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          const activeIndex = containers.indexOf(active.id)
          const overIndex = containers.indexOf(over.id)

          const _containers = arrayMove(containers, activeIndex, overIndex)
          onChange(
            _containers.map(k => ({
              ...itemMap[k],
              children: items[k].map(v => itemMap[v]),
            })),
          )
        }

        const activeContainer = findContainer(active.id)

        if (!activeContainer) {
          setActiveId(null)
          return
        }

        const overId = over?.id

        if (overId == null) {
          setActiveId(null)
          return
        }

        const overContainer = findContainer(overId)

        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id)
          const overIndex = items[overContainer].indexOf(overId)

          if (activeIndex !== overIndex) {
            onChange(
              containers.map(k => {
                if (k === overContainer) {
                  return {
                    ...itemMap[k],
                    children: arrayMove(items[overContainer], activeIndex, overIndex).map(v => itemMap[v]),
                  }
                } else {
                  return {
                    ...itemMap[k],
                    children: items[k].map(v => itemMap[v]),
                  }
                }
              }),
            )
          }
        }

        setActiveId(null)
      }}
      // cancelDrop={cancelDrop}
      // onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        style={{
          display: 'grid',
          boxSizing: 'border-box',
          gridAutoFlow: vertical ? 'row' : 'column',
        }}
      >
        <SortableContext
          disabled={disabled}
          items={containers}
          strategy={vertical ? verticalListSortingStrategy : horizontalListSortingStrategy}
        >
          {containers.map((containerId, index) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={itemMap[containerId].title}
              columns={columns}
              disabled={containerDisabled}
              items={items[containerId]}
              scrollable={scrollable}
              style={containerStyle}
              unstyled={minimal}
              gray={gray}
              renderTitle={title => renderTitle(title, index)}
            >
              <SortableContext items={items[containerId]} strategy={strategy}>
                {items[containerId].map((value, index) => {
                  return (
                    <SortableItem
                      disabled={disabled || isSortingContainer}
                      key={value}
                      id={value}
                      gray={gray}
                      value={itemMap[value]}
                      index={index}
                      handle={handle}
                      style={getItemStyles}
                      wrapperStyle={wrapperStyle}
                      renderItem={renderItem}
                      containerId={containerId}
                      getIndex={getIndex}
                    />
                  )
                })}
              </SortableContext>
            </DroppableContainer>
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId, itemMap[activeId])
              : renderSortableItemDragOverlay(activeId, itemMap[activeId])
            : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )

  function renderSortableItemDragOverlay(id: UniqueIdentifier, value) {
    return (
      <Item
        value={value}
        handle={handle}
        gray={gray}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    )
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier, value) {
    return (
      <Container
        label={itemMap[containerId]?.title}
        columns={columns}
        style={{
          height: '100%',
        }}
        shadow
        unstyled={false}
        renderTitle={title => renderTitle(title, containers.indexOf(containerId))}
      >
        {items[containerId].map((item, index) => (
          <Item
            key={item}
            value={itemMap[item]}
            handle={handle}
            gray={gray}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item),
              value: item,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            wrapperStyle={wrapperStyle({ index })}
            renderItem={renderItem}
          />
        ))}
      </Container>
    )
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items)
    const lastContainerId = containerIds[containerIds.length - 1]

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1)
  }
}

interface SortableItemProps {
  containerId: UniqueIdentifier
  id: UniqueIdentifier
  index: number
  handle: boolean
  disabled?: boolean
  value?: any
  gray?: boolean
  style(args: any): React.CSSProperties
  getIndex(id: UniqueIdentifier): number
  renderItem(): React.ReactElement
  wrapperStyle({ index }: { index: number }): React.CSSProperties
}

function SortableItem({
  disabled,
  id,
  value,
  index,
  handle,
  renderItem,
  style,
  containerId,
  getIndex,
  wrapperStyle,
  gray,
}: SortableItemProps) {
  const { setNodeRef, setActivatorNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } =
    useSortable({
      id,
    })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      gray={gray}
      value={value}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  )
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}
