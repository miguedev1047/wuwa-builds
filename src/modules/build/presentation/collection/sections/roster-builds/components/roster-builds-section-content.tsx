import { FlowingMenu, type FlowingMenuItem } from "@/components/ui/flowing-menu"
import { useUserRosters } from "@build/client/hooks/build-live-queries"
import { BuildsEmpty } from "@build/presentation/collection/components/builds-empty"
import { RosterBuildsSheet } from "@build/presentation/collection/sections/roster-builds/components/roster-builds-sheet"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type RosterBuildsSectionContentProps = {
  /** User that owns the local builds. */
  userId: string
}

/** Loads the rosters and owns the selected roster for the Sheet. */
export function RosterBuildsSectionContent({
  userId,
}: RosterBuildsSectionContentProps) {
  const { data: rosters } = useUserRosters(userId)
  const [selectedRosterId, setSelectedRosterId] = useState<number | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const selectedRoster =
    rosters.find(({ resonatorId }) => resonatorId === selectedRosterId) ?? null

  if (rosters.length === 0) {
    return (
      <BuildsEmpty
        className="mx-4 md:mx-8"
        icon={<HugeiconsIcon icon={UserIcon} />}
        title="Todavía no tienes builds con resonador"
        description="Cuando asignes un resonador a una build, aparecerá aquí."
      />
    )
  }

  const items: FlowingMenuItem[] = rosters.map((roster) => {
    const metaDesc = `${roster.totalBuilds} ${
      roster.totalBuilds === 1 ? "build" : "builds"
    }`

    return {
      type: "button",
      text: roster.name,
      meta: metaDesc,
      className: "min-h-40 md:min-h-50",
      image: roster.iconLarge,
      onClick: () => {
        setSelectedRosterId(roster.resonatorId)
        setSheetOpen(true)
      },
    }
  })

  return (
    <>
      <FlowingMenu
        items={items}
        ariaLabel="Tus resonadores"
        align="left"
        imageShape="circle"
        textColor="var(--card-foreground)"
        bgColor="var(--card)"
        marqueeBgColor="var(--primary)"
        marqueeTextColor="var(--primary-foreground)"
        borderColor="var(--border)"
      />

      <RosterBuildsSheet
        roster={selectedRoster}
        userId={userId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onOpenChangeComplete={(open) => {
          if (!open) setSelectedRosterId(null)
        }}
      />
    </>
  )
}
