import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Show } from "@/components/utility/show"
import { DeleteIcon, PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"
import {
  Fragment,
  useState,
  type ComponentProps,
  type Key,
  type ReactElement,
  type ReactNode,
} from "react"

/**
 * Section whose content can be edited and deleted.
 *
 * A compound component built on shadcn primitives: `Content`/`Media`/`Body`
 * render a single editable block, `List`/`Item` render rows, and the actions
 * always end in a `Dialog` for edit and an `AlertDialog` for delete, both at
 * section level and inside list rows.
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

export function EditableSectionAction({
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
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="editable-section-content"
      className={cn(
        "rounded-lg bg-card p-4 ring-1 ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

export function EditableSectionMedia({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="editable-section-media"
      className={cn("shrink-0 overflow-hidden rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export function EditableSectionBody({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="editable-section-body"
      className={cn("flex flex-1 flex-col gap-2", className)}
      {...props}
    />
  )
}

export function EditableSectionHeading({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="editable-section-heading"
      className={cn("font-heading text-2xl font-bold", className)}
      {...props}
    />
  )
}

export function EditableSectionText({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="editable-section-text"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

type EditableSectionListProps<T> = {
  items: readonly T[]
  /** Render prop for each row; it must return an `Item`. */
  children: (item: T, index: number) => ReactNode
  /** Rendered instead of the list when `items` is empty. */
  empty?: ReactNode
  /** Defaults to the item index, which is only safe for static lists. */
  getItemKey?: (item: T, index: number) => Key
}

export function EditableSectionList<T>({
  items,
  children,
  empty = null,
  getItemKey,
}: EditableSectionListProps<T>) {
  if (items.length === 0) {
    return <>{empty}</>
  }

  return (
    <ItemGroup data-slot="editable-section-list">
      {items.map((item, index) => (
        <Fragment key={getItemKey?.(item, index) ?? index}>
          {children(item, index)}
        </Fragment>
      ))}
    </ItemGroup>
  )
}

export function EditableSectionItem({
  className,
  ...props
}: ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="editable-section-item"
      className={cn("bg-card/50", className)}
      {...props}
    />
  )
}

type EditableSectionEditActionProps = {
  title: string
  description?: string
  /** Accessible name of the default icon trigger. */
  label?: string
  /** Replaces the default icon button. */
  trigger?: ReactElement
  dialogProps?: ComponentProps<typeof Dialog>
  contentProps?: ComponentProps<typeof DialogContent>
  /** Receives `close` so the dialog can close after saving. */
  children: (controls: { close: () => void }) => ReactNode
}

export function EditableSectionEditAction({
  title,
  description,
  label = "Editar",
  trigger,
  dialogProps,
  contentProps,
  children,
}: EditableSectionEditActionProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen} {...dialogProps}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={label}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} />
            </Button>
          )
        }
      />

      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Show when={description}>
            <DialogDescription>{description}</DialogDescription>
          </Show>
        </DialogHeader>
        {children({ close })}
      </DialogContent>
    </Dialog>
  )
}

type EditableSectionDeleteActionProps = {
  title: string
  description?: ReactNode
  /** Accessible name of the default icon trigger. */
  label?: string
  confirmLabel?: string
  cancelLabel?: string
  pendingLabel?: string
  isPending?: boolean
  onConfirm: () => void
  /** Replaces the default icon button. */
  trigger?: ReactElement
  contentProps?: ComponentProps<typeof AlertDialogContent>
}

export function EditableSectionDeleteAction({
  title,
  description,
  label = "Eliminar",
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  pendingLabel = "Eliminando...",
  isPending = false,
  onConfirm,
  trigger,
  contentProps,
}: EditableSectionDeleteActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          trigger ?? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={label}
            >
              <HugeiconsIcon icon={DeleteIcon} />
            </Button>
          )
        }
      />

      <AlertDialogContent size="sm" {...contentProps}>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <HugeiconsIcon icon={DeleteIcon} />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <Show when={description}>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </Show>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel size="xl" disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            size="xl"
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const EditableSection = {
  Root: EditableSectionRoot,
  Header: EditableSectionHeader,
  Title: EditableSectionTitle,
  Description: EditableSectionDescription,
  Action: EditableSectionAction,
  Content: EditableSectionContent,
  Media: EditableSectionMedia,
  Body: EditableSectionBody,
  Heading: EditableSectionHeading,
  Text: EditableSectionText,
  List: EditableSectionList,
  Item: EditableSectionItem,
  ItemMedia: ItemMedia,
  ItemContent: ItemContent,
  ItemTitle: ItemTitle,
  ItemDescription: ItemDescription,
  ItemActions: ItemActions,
  EditAction: EditableSectionEditAction,
  DeleteAction: EditableSectionDeleteAction,
} as const
