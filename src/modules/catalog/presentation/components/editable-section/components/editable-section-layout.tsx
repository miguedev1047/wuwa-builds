import { Card } from "@/components/panelui/card"
import { cn } from "cn"
import { type ComponentProps } from "react"

/**
 * Section whose content can be edited and deleted.
 *
 * A compound component built on shadcn primitives: `Content`/`Media`/`Body`
 * render a single editable block, `List`/`Item` and `Card` render rows, and
 * the actions always end in a `Dialog` for create/edit and an `AlertDialog`
 * for delete, both at section level and inside list rows.
 */

export function EditableSectionRoot({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="editable-section"
      className={cn(
        "space-y-4 [--editable-section-spacing:--spacing(4)]",
        className
      )}
      {...props}
    />
  )
}

export function EditableSectionHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="editable-section-header"
      className={cn(
        "group/editable-section-header @container/editable-section-header grid auto-rows-min items-start gap-1 has-data-[slot=editable-section-action]:grid-cols-[1fr_auto] has-data-[slot=editable-section-description]:grid-rows-[auto_auto] [.border-b]:pb-(--editable-section-spacing)",
        className
      )}
      {...props}
    />
  )
}

export function EditableSectionTitle({
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="editable-section-title"
      className={cn("font-heading text-lg font-bold md:text-2xl", className)}
      {...props}
    />
  )
}

export function EditableSectionDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="editable-section-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

export function EditableSectionActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="editable-section-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-1 self-start justify-self-end md:gap-2",
        className
      )}
      {...props}
    />
  )
}

export function EditableSectionContent({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="editable-section-content"
      className={cn("p-4", className)}
      {...props}
    />
  )
}
