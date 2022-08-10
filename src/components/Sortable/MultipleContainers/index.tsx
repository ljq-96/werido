import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal, unstable_batchedUpdates } from 'react-dom'
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
  useDroppable,
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
import { BookmarkType } from '../../../../server/types'

export default {
  title: 'Presets/Sortable/Multiple Containers',
}

const animateLayoutChanges: AnimateLayoutChanges = args => defaultAnimateLayoutChanges({ ...args, wasDragging: true })

function DroppableContainer({
  children,
  columns = 1,
  disabled,
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
      ref={disabled ? undefined : setNodeRef}
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
  value: BookmarkType[]
  disabled?: boolean
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
  itemCount?: number
  items?: Items
  handle?: boolean
  renderItem?: any
  strategy?: SortingStrategy
  modifiers?: Modifiers
  minimal?: boolean
  trashable?: boolean
  scrollable?: boolean
  vertical?: boolean
}

const empty: UniqueIdentifier[] = []

export function MultipleContainers({
  value,
  disabled,
  adjustScale = false,
  itemCount = 3,
  cancelDrop,
  columns,
  handle = false,
  items: initialItems,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  vertical = false,
  scrollable,
}: Props) {
  const [items, setItems] = useState<Items>(() =>
    value.reduce((prev, next) => {
      prev[next._id] = next.children.map(item => item._id)
      return prev
    }, {}),
  )

  const itemMap = useMemo(() => {
    const res: any = {}
    value.forEach(k => {
      res[k._id] = k
      k.children.forEach(v => (res[v._id] = v))
    })
    return res
  }, [value])

  const [containers, setContainers] = useState(Object.keys(items) as UniqueIdentifier[])
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId ? containers.includes(activeId) : false

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    args => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => container.id in items),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId]

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
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

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
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

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems)
    }

    setActiveId(null)
    setClonedItems(null)
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
          setItems(items => {
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

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter(item => item !== active.id),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(newIndex, items[overContainer].length),
              ],
            }
          })
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          setContainers(containers => {
            const activeIndex = containers.indexOf(active.id)
            const overIndex = containers.indexOf(over.id)

            return arrayMove(containers, activeIndex, overIndex)
          })
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
            setItems(items => ({
              ...items,
              [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
            }))
          }
        }

        setActiveId(null)
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
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
          {containers.map(containerId => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={itemMap[containerId].title}
              columns={columns}
              items={items[containerId]}
              scrollable={scrollable}
              style={containerStyle}
              unstyled={minimal}
              onRemove={() => handleRemove(containerId)}
            >
              <SortableContext items={items[containerId]} strategy={strategy}>
                {items[containerId].map((value, index) => {
                  return (
                    <SortableItem
                      disabled={disabled || isSortingContainer}
                      key={value}
                      id={value}
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
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(id)}
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
      >
        {items[containerId].map((item, index) => (
          <Item
            key={item}
            value={itemMap[item]}
            handle={handle}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item),
              value: item,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(item)}
            wrapperStyle={wrapperStyle({ index })}
            renderItem={renderItem}
          />
        ))}
      </Container>
    )
  }

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers(containers => containers.filter(id => id !== containerID))
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId()

    unstable_batchedUpdates(() => {
      setContainers(containers => [...containers, newContainerId])
      setItems(items => ({
        ...items,
        [newContainerId]: [],
      }))
    })
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items)
    const lastContainerId = containerIds[containerIds.length - 1]

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1)
  }
}

function getColor(id: UniqueIdentifier) {
  switch (String(id)[0]) {
    case 'A':
      return '#7193f1'
    case 'B':
      return '#ffda6c'
    case 'C':
      return '#00bcd4'
    case 'D':
      return '#ef769f'
  }

  return undefined
}

function Trash({ id }: { id: UniqueIdentifier }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '50%',
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 60,
        borderRadius: 5,
        border: '1px solid',
        borderColor: isOver ? 'red' : '#DDD',
      }}
    >
      Drop here to delete
    </div>
  )
}

interface SortableItemProps {
  containerId: UniqueIdentifier
  id: UniqueIdentifier
  index: number
  handle: boolean
  disabled?: boolean
  value?: any
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
      color={getColor(id)}
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
