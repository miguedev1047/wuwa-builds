import { RouteNavigation } from "@/components/blocks/route-navigation"
import { FlowingMenu, type FlowingMenuItem } from "@/components/ui/flowing-menu"
import { formatDay } from "@/lib/format-date"
import { useUnassignedBuilds } from "@build/client/hooks/build-live-queries"
import { BACKGROUNDS } from "@build/application/backgrounds"
import { buildLinkOptions } from "@build/presentation/my-builds/build-link-options"

type UnassignedBuildsSectionContentProps = {
  /** User that owns the local builds. */
  userId: string
}

/** Loads and paints the builds that still have no resonator. */
export function UnassignedBuildsSectionContent({
  userId,
}: UnassignedBuildsSectionContentProps) {
  const { data: builds } = useUnassignedBuilds(userId)

  if (builds.length === 0) return null

  const items: FlowingMenuItem[] = builds.map((build) => ({
    type: "link",
    linkOptions: buildLinkOptions(build.buildId),
    text: build.name,
    meta: formatDay(build.updateAt),
    image:
      build.backgroundIndex === null
        ? undefined
        : BACKGROUNDS[build.backgroundIndex],
    className: "min-h-40 md:min-h-50",
  }))

  return (
    <section className="space-y-10">
      <RouteNavigation.Header>
        <RouteNavigation.Title as="h2">Sin resonador</RouteNavigation.Title>
        <RouteNavigation.Description>
          Borradores a los que todavía no les asignas un resonador.
        </RouteNavigation.Description>
      </RouteNavigation.Header>

      <FlowingMenu
        items={items}
        ariaLabel="Builds sin resonador"
        align="left"
        imageShape="circle"
        textColor="var(--card-foreground)"
        bgColor="var(--card)"
        marqueeBgColor="var(--primary)"
        marqueeTextColor="var(--primary-foreground)"
        borderColor="var(--border)"
      />
    </section>
  )
}
