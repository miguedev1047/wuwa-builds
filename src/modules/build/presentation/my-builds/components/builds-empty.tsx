import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Show } from "@/components/utility/show"
import { cn } from "cn"
import type { ReactNode } from "react"

type BuildsEmptyProps = {
  /** Headline of the empty state. */
  title: string
  /** Sentence that explains how to fill the section. */
  description: string
  /** Icon rendered inside the media slot. */
  icon: ReactNode
  /** Primary action offered by the empty state, such as "Nueva Build". */
  action?: ReactNode
  /** Extra classes for the empty surface. */
  className?: string
}

/** Shared empty state for the local build library. */
export function BuildsEmpty({
  title,
  description,
  icon,
  action,
  className,
}: BuildsEmptyProps) {
  return (
    <Empty
      className={cn("relative overflow-hidden border border-dashed", className)}
    >
      <EmptyHeader className="z-10">
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      <Show when={action}>
        <EmptyContent>{action}</EmptyContent>
      </Show>

      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </Empty>
  )
}
