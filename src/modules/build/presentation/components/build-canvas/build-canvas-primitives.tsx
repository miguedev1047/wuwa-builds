import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/** Heading sizes available to the builder sections. */
export const buildCanvasTextVariants = cva(
  "line-clamp-1 font-bold text-muted-foreground",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        normal: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl",
      },
      family: {
        normal: "font-normal",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      uppercase: {
        true: "uppercase",
        false: "",
      },
      textColor: {
        normal: "text-foreground",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "normal",
      family: "semibold",
      textColor: "normal",
      uppercase: true,
    },
  }
)

export interface BuildCanvasTextProps
  extends
    React.ComponentProps<"h2">,
    VariantProps<typeof buildCanvasTextVariants> {}

/**
 * Section heading of the builder surfaces.
 *
 * It always renders an `h2`, so the screen keeps one `h1` per route and every
 * section title stays at the same level.
 */
export function BuildCanvasText({
  className,
  textColor,
  family,
  uppercase,
  size,
  ...props
}: BuildCanvasTextProps) {
  return (
    <h2
      className={cn(
        buildCanvasTextVariants({ size, textColor, uppercase, family }),
        className
      )}
      {...props}
    />
  )
}

export const buildCanvasSurfaceVariants = cva(
  "rounded-lg p-4 shadow-app-surface",
  {
    variants: {
      cardColor: {
        default: "bg-card",
        glass: "bg-card/50 backdrop-blur-2xl",
        input: "bg-input/50",
        muted: "bg-muted",
      },
    },
    defaultVariants: {
      cardColor: "default",
    },
  }
)

export interface BuildCanvasSurfaceProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof buildCanvasSurfaceVariants> {}

export function BuildCanvasSurface({
  className,
  cardColor,
  ...props
}: BuildCanvasSurfaceProps) {
  return (
    <div
      className={cn(buildCanvasSurfaceVariants({ cardColor }), className)}
      {...props}
    />
  )
}
