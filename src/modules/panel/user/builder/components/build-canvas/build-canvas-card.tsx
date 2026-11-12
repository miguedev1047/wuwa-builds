import type { BuildCanvasArea } from "@builder/components/build-canvas/build-canvas-layout"
import { cn } from "cn"

type BuildCanvasCardProps = React.ComponentProps<"div"> & {
  /** Area of the `.build-canvas` grid this card fills. */
  area: BuildCanvasArea
}

/**
 * Card surface and grid item of one canvas panel.
 *
 * The named area comes from `data-canvas-area`, mapped once in `.build-canvas`,
 * so panels never use line numbers. The card fills its cell and clips its
 * content, which is what keeps the fixed 90px rows stable.
 */
export function BuildCanvasCard({
  area,
  className,
  ...props
}: BuildCanvasCardProps) {
  return (
    <div
      data-canvas-area={area}
      className={cn(
        "relative flex h-full min-h-0 flex-col gap-2 overflow-hidden rounded-xl bg-card p-3 text-sm text-card-foreground shadow-app-surface ring-1 ring-foreground/5 dark:ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}
