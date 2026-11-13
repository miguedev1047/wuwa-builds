import { useParams } from "@tanstack/react-router"
import { Suspense } from "react"
import { EchoInfoContent } from "@panel/admin/game-data/views/echoes/detail/sections/info/components/echo-info-content"
import { EchoInfoSkeleton } from "@panel/admin/game-data/views/echoes/detail/sections/info/components/echo-info-skeleton"

/** Summary (`echoes`) of the echo. */
export function EchoInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/echoes/$id" })
  const echoId = Number(id)

  return (
    <Suspense fallback={<EchoInfoSkeleton />}>
      <EchoInfoContent echoId={echoId} />
    </Suspense>
  )
}
