import { Skeleton } from "@/components/ui/skeleton"
import {
  CatalogSection,
  type CatalogSectionAspect,
} from "@panel/admin/game-data/components/catalog-section"
import { Show } from "@/components/utility/show"

type CatalogListRouteSkeletonProps = {
  /** Real page title, so the pending state does not shift when data arrives. */
  title: string
  /** Real page description. */
  description: string
  cols: 4 | 6 | 10
  aspect: CatalogSectionAspect
  /** Number of placeholder cards. */
  count: number
  /** Number of header action placeholders; defaults to none. */
  actionCount?: number
}

/** Page-shaped loading state for a catalog list route. */
export function CatalogListRouteSkeleton({
  title,
  description,
  cols,
  aspect,
  count,
  actionCount = 0,
}: CatalogListRouteSkeletonProps) {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>{title}</CatalogSection.Title>
        <CatalogSection.Description>{description}</CatalogSection.Description>

        <Show when={actionCount > 0}>
          <CatalogSection.Action>
            {Array.from({ length: actionCount }, (_, index) => (
              <Skeleton key={index} className="h-8 w-24" />
            ))}
          </CatalogSection.Action>
        </Show>
      </CatalogSection.Header>

      <CatalogSection.Loading cols={cols} aspect={aspect} count={count} />
    </CatalogSection.Root>
  )
}

type CatalogDetailRouteSkeletonProps = {
  /** Number of editable sections below the info block; defaults to 3. */
  sections?: number
}

/** Page-shaped loading state for a catalog detail route. */
export function CatalogDetailRouteSkeleton({
  sections = 3,
}: CatalogDetailRouteSkeletonProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-1">
          <Skeleton className="h-8 w-48" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-18" />
            <Skeleton className="size-7" />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-4 md:flex-row">
          <Skeleton className="h-60 w-40 rounded-none" />

          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-8 w-2/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-9/10" />
            <Skeleton className="h-3 w-7/10" />
          </div>
        </div>
      </div>

      {Array.from({ length: sections }, (_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-35 w-full rounded-lg" />
          <Skeleton className="h-35 w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}
