'use client'

import React, { createContext, useContext, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  type SortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export { arrayMove, rectSortingStrategy, verticalListSortingStrategy, horizontalListSortingStrategy }

/* ── Context for item handle attributes ────────────────────────────────────── */
interface SortableItemContextValue {
  attributes: Record<string, any>
  listeners: Record<string, any> | undefined
  isDragging: boolean
}

const SortableItemContext = createContext<SortableItemContextValue>({
  attributes: {},
  listeners: undefined,
  isDragging: false,
})

export function useSortableItem() {
  return useContext(SortableItemContext)
}

/* ── SortableList Container ───────────────────────────────────────────────── */
interface Identifiable {
  id: string
}

interface SortableListProps<T extends Identifiable> {
  items: T[]
  onReorder: (newItems: T[]) => void
  children: React.ReactNode
  strategy?: SortingStrategy
  className?: string
  layout?: 'vertical' | 'horizontal' | 'grid'
}

export function SortableList<T extends Identifiable>({
  items,
  onReorder,
  children,
  strategy,
  className = '',
  layout = 'vertical',
}: SortableListProps<T>) {
  // Mobile-friendly sensors setup:
  // - PointerSensor for desktop mouse
  // - TouchSensor with delay & tolerance so page scrolling on mobile isn't hijacked
  // - KeyboardSensor for full accessibility
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor)

  const itemIds = useMemo(() => items.map((item) => item.id), [items])

  const chosenStrategy = useMemo(() => {
    if (strategy) return strategy
    if (layout === 'grid') return rectSortingStrategy
    if (layout === 'horizontal') return horizontalListSortingStrategy
    return verticalListSortingStrategy
  }, [strategy, layout])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(items, oldIndex, newIndex))
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={chosenStrategy}>
        <div className={className}>{children}</div>
      </SortableContext>
    </DndContext>
  )
}

/* ── SortableItem Wrapper ─────────────────────────────────────────────────── */
interface SortableItemProps {
  id: string
  children: React.ReactNode | ((context: SortableItemContextValue) => React.ReactNode)
  className?: string
  as?: React.ElementType
  style?: React.CSSProperties
}

export function SortableItem({ id, children, className = '', as: Component = 'div', style: customStyle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    ...customStyle,
  }

  const contextValue = useMemo(
    () => ({ attributes, listeners, isDragging }),
    [attributes, listeners, isDragging]
  )

  return (
    <SortableItemContext.Provider value={contextValue}>
      <Component ref={setNodeRef} style={style} className={className}>
        {typeof children === 'function' ? children(contextValue) : children}
      </Component>
    </SortableItemContext.Provider>
  )
}

/* ── SortableHandle ───────────────────────────────────────────────────────── */
interface SortableHandleProps {
  className?: string
  iconSize?: number
}

export function SortableHandle({ className = '', iconSize = 14 }: SortableHandleProps) {
  const { attributes, listeners, isDragging } = useSortableItem()

  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      className={`cursor-grab active:cursor-grabbing p-1 text-fg-subtle hover:text-foreground transition-colors shrink-0 touch-none select-none ${
        isDragging ? 'cursor-grabbing text-brand' : ''
      } ${className}`}
    >
      <GripVertical size={iconSize} strokeWidth={1.75} />
    </button>
  )
}
