import type { ComponentProps } from "react"
import { BACKGROUNDS } from "@builds/application/backgrounds"
import { cn } from "cn"

type BuildBackgroundProps = ComponentProps<"div"> & {
  /** Selected build background index. */
  backgroundIndex: number | null
}

/** Shared blurred background layer for the workspace and PNG export cards. */
export function BuildBackground({
  backgroundIndex,
  className,
  children,
  ...props
}: BuildBackgroundProps) {
  const background = BACKGROUNDS[backgroundIndex ?? 0]

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-lg p-4",
        className
      )}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-app-backdrop"
          style={{ backgroundImage: `url(${background})` }}
        />
      </div>
      {children}
    </div>
  )
}
