import { SkeletonBox } from "skullet/react"
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
              <SkeletonBox key={index} width={96} height={32} />
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
          <SkeletonBox width="12rem" height={32} />

          <div className="flex items-center gap-2">
            <SkeletonBox width={72} height={28} />
            <SkeletonBox width={28} height={28} />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-4 md:flex-row">
          <SkeletonBox width={160} height={240} radius={0} />

          <div className="flex flex-1 flex-col gap-3">
            <SkeletonBox width="40%" height={32} />
            <SkeletonBox width="100%" height={12} />
            <SkeletonBox width="90%" height={12} />
            <SkeletonBox width="70%" height={12} />
          </div>
        </div>
      </div>

      {Array.from({ length: sections }, (_, index) => (
        <div key={index} className="space-y-4">
          <SkeletonBox width="10rem" height={20} />
          <SkeletonBox width="16rem" height={12} />
          <SkeletonBox width="100%" height={140} radius={8} />
          <SkeletonBox width="100%" height={140} radius={8} />
        </div>
      ))}
    </div>
  )
}
