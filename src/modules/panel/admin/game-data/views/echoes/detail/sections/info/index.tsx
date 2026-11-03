import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { EchoInfoContent } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/info/components/echo-info-content"
import { EchoInfoSkeleton } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/info/components/echo-info-skeleton"

/** Summary (`echoes`) of the echo. */
export function EchoInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/echoes/$id" })
  const echoId = Number(id)

  return (
    <SkeletonSuspense skeleton={<EchoInfoSkeleton />}>
      <EchoInfoContent echoId={echoId} />
    </SkeletonSuspense>
  )
}
