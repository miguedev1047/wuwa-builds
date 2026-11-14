import { Show } from "@/components/utility/show"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import type { ReactNode } from "react"
type CatalogSectionEmptyProps = {
  title: ReactNode
  description: ReactNode
  action?: ReactNode
}

export function CatalogSectionEmpty({
  title,
  description,
  action,
}: CatalogSectionEmptyProps) {
  return (
    <Empty className="h-100 border border-dashed">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Show when={action}>
        {(content) => <EmptyContent>{content}</EmptyContent>}
      </Show>
    </Empty>
  )
}
