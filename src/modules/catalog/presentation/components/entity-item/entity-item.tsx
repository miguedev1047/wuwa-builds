import { Image } from "@/components/ui/image"
import { cn } from "cn"
import type { ReactNode } from "react"

type EntityItemProps = {
  src: string
  alt: string
  /** Extra classes for the frame; the parent owns the size. */
  className?: string
  /** Overlay content, such as the resonator curation badges. */
  children?: ReactNode
}

/**
 * Shared frame of one catalog entity thumbnail.
 *
 * It fills whatever box the list, grid or command row gives it, so the same
 * item renders as a large card or a compact row icon without a size prop.
 */
export function EntityItem({ src, alt, className, children }: EntityItemProps) {
  return (
    <div
      data-slot="entity-item"
      className={cn(
        "relative size-full overflow-hidden rounded-lg bg-accent",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        size="full"
        aspect="portrait"
        fit="cover"
        background="transparent"
        hover="zoom"
        className="size-full"
      />
      {children}
    </div>
  )
}
