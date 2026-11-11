import { useEffect, useRef, useState } from "react"
import { cn } from "cn"

/** Pointer travel that turns a press into a drag. */
const DRAG_THRESHOLD = 6

type DragGesture = {
  pointerId: number
  startX: number
  startScroll: number
  moved: boolean
}

interface DragScrollProps {
  /** Accessible name of the scrollable region. */
  label: string
  className?: string
  children: React.ReactNode
}

/**
 * Horizontal scroll viewport that can also be dragged with a mouse or a pen.
 *
 * Touch keeps the native scrolling, the drag only starts after the pointer
 * travels past a threshold, and the click that closes a drag never reaches the
 * interactive children underneath. The region is focusable, so the arrow keys
 * scroll it without a pointer.
 */
export function DragScroll({ label, className, children }: DragScrollProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<DragGesture | null>(null)
  const draggedRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) return

    const update = () => {
      setCanScroll(viewport.scrollWidth > viewport.clientWidth + 1)
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [])

  const endGesture = () => {
    const gesture = gestureRef.current
    const viewport = viewportRef.current

    gestureRef.current = null
    setIsDragging(false)

    if (!gesture) return

    draggedRef.current = gesture.moved

    if (gesture.moved) {
      window.setTimeout(() => {
        draggedRef.current = false
      }, 0)
    }

    if (viewport?.hasPointerCapture(gesture.pointerId)) {
      viewport.releasePointerCapture(gesture.pointerId)
    }
  }

  const handleLostCapture = () => {
    gestureRef.current = null
    setIsDragging(false)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current

    draggedRef.current = false

    if (!viewport || event.pointerType === "touch" || event.button !== 0) {
      return
    }

    if (viewport.scrollWidth <= viewport.clientWidth + 1) return

    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: viewport.scrollLeft,
      moved: false,
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    const viewport = viewportRef.current

    if (!gesture || !viewport || gesture.pointerId !== event.pointerId) return

    const offset = event.clientX - gesture.startX

    if (!gesture.moved) {
      if (Math.abs(offset) < DRAG_THRESHOLD) return

      gesture.moved = true
      setIsDragging(true)
      viewport.setPointerCapture(event.pointerId)
    }

    viewport.scrollLeft = gesture.startScroll - offset
  }

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedRef.current) return

    draggedRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      ref={viewportRef}
      role="group"
      aria-label={label}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
      onLostPointerCapture={handleLostCapture}
      onDragStart={(event) => event.preventDefault()}
      onClickCapture={handleClickCapture}
      className={cn(
        "no-scrollbar overflow-x-auto overscroll-x-contain outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        canScroll && "cursor-grab",
        isDragging && "cursor-grabbing",
        className
      )}
    >
      {children}
    </div>
  )
}
