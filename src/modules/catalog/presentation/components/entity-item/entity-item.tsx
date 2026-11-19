import { Image } from "@/components/ui/image"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

type EntityItemProps = Omit<ComponentProps<"div">, "children"> & {
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
 * Extra props (and the ref) reach the frame, so it can be a tooltip trigger.
 */
export function EntityItem({
  src,
  alt,
  className,
  children,
  ...props
}: EntityItemProps) {
  return (
    <div
      data-slot="entity-item"
      className={cn(
        "relative size-full overflow-hidden rounded-lg bg-accent",
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        size="full"
        aspect="portrait"
        fit="cover"
        background="transparent"
        hover="lift"
        className="size-full"
      />
      {children}
    </div>
  )
}
