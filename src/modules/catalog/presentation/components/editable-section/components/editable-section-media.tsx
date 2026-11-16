import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { type ComponentProps } from "react"

const editableSectionMediaVariants = cva(
  "shrink-0 overflow-hidden rounded-md bg-muted-foreground dark:bg-muted",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        image:
          "flex items-center justify-center overflow-hidden rounded-sm bg-muted-foreground dark:bg-muted [&_img]:size-full [&_img]:object-cover",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      {
        variant: "image",
        size: "sm",
        className: "size-6 p-0.5",
      },
      {
        variant: "image",
        size: "md",
        className: "size-8 p-1",
      },
      {
        variant: "image",
        size: "lg",
        className: "size-12 p-1.5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

type EditableSectionMediaProps = ComponentProps<"div"> &
  VariantProps<typeof editableSectionMediaVariants>

export function EditableSectionMedia({
  className,
  variant,
  size,
  ...props
}: EditableSectionMediaProps) {
  return (
    <div
      data-slot="editable-section-media"
      className={cn(editableSectionMediaVariants({ variant, size }), className)}
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
