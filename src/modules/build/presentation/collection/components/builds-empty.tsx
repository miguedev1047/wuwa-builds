import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "cn"
import type { ReactNode } from "react"

type BuildsEmptyProps = {
  /** Headline of the empty state. */
  title: string
  /** Sentence that explains how to fill the section. */
  description: string
  /** Icon rendered inside the media slot. */
  icon: ReactNode
  /** Extra classes for the empty surface. */
  className?: string
}

/** Shared empty state for the local build library. */
export function BuildsEmpty({
  title,
  description,
  icon,
  className,
}: BuildsEmptyProps) {
  return (
    <Empty className={cn("border border-dashed", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
