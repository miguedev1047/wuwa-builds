import { Suspense } from "react"
import { EchoInfoContent } from "@catalog/presentation/echoes/detail/sections/info/components/echo-info-content"
import { EchoInfoSkeleton } from "@catalog/presentation/echoes/detail/sections/info/components/echo-info-skeleton"

/** Summary (`echoes`) of the echo. */
export function EchoInfoSection({ echoId }: { echoId: number }) {
  return (
    <Suspense fallback={<EchoInfoSkeleton />}>
      <EchoInfoContent echoId={echoId} />
    </Suspense>
  )
}
