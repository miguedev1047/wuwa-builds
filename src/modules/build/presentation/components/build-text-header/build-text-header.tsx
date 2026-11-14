import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/** Heading sizes available to the builder sections. */
export const buildTextHeaderVariants = cva(
  "font-bold text-muted-foreground uppercase",
  {
    variants: {
      size: {
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl",
      },
    },
    defaultVariants: {
      size: "2xl",
    },
  }
)

export interface BuildTextHeaderProps
  extends
    React.ComponentProps<"h2">,
    VariantProps<typeof buildTextHeaderVariants> {}

/**
 * Section heading of the builder surfaces.
 *
 * It always renders an `h2`, so the screen keeps one `h1` per route and every
 * section title stays at the same level.
 */
export function BuildTextHeader({
  className,
  size,
  ...props
}: BuildTextHeaderProps) {
  return (
    <h2
      className={cn(buildTextHeaderVariants({ size }), className)}
      {...props}
    />
  )
}
