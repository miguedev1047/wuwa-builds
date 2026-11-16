import { ItemMedia } from "@/components/ui/item"
import { cn } from "cn"
import { type ComponentProps } from "react"

export function EditableSectionItemMedia({
  className,
  ...props
}: ComponentProps<typeof ItemMedia>) {
  return (
    <ItemMedia
      data-slot="editable-section-item-media"
      className={cn("bg-muted-foreground dark:bg-muted", className)}
      {...props}
    />
  )
}

interface EditableSectionImage extends React.ComponentProps<"img"> {
  animated?: boolean
}

export function EditableSectionImage({
  className,
  animated,
  ...props
}: EditableSectionImage) {
  return (
    <img
      data-slot="editable-section-image"
      className={cn(
        "pointer-events-none size-full! object-cover transition-transform ease-in-out select-none",
        animated && "hover:scale-120",
        className
      )}
      {...props}
    />
  )
}
