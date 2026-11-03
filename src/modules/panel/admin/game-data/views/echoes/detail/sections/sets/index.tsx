import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { EchoSetAddLoader } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-set-add-loader"
import { EchoSetsContent } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-sets-content"
import { EchoSetsSkeleton } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-sets-skeleton"

/** Sonata sets the echo can hold, with the Encore-assisted picker. */
export function EchoSetsSection() {
  const { id } = useParams({ from: "/(panel)/admin/echoes/$id" })
  const echoId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Sets de sonata</EditableSection.Title>

        <EditableSection.Description>
          Sets que puede llevar este eco según Encore.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense skeleton={<SkeletonBox width={96} height={28} />}>
            <EchoSetAddLoader echoId={echoId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<EchoSetsSkeleton />}>
        <EchoSetsContent echoId={echoId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
