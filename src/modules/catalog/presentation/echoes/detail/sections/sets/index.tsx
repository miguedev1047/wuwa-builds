import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSetAddLoader } from "@catalog/presentation/echoes/detail/sections/sets/components/echo-set-add-loader"
import { EchoSetsContent } from "@catalog/presentation/echoes/detail/sections/sets/components/echo-sets-content"
import { EchoSetsSkeleton } from "@catalog/presentation/echoes/detail/sections/sets/components/echo-sets-skeleton"
import { Suspense } from "react"

/** Sonata sets the echo can hold, with the Encore-assisted picker. */
export function EchoSetsSection({ echoId }: { echoId: number }) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Sets de sonata</EditableSection.Title>

        <EditableSection.Description>
          Sets que puede llevar este eco según Encore.
        </EditableSection.Description>

        <EditableSection.Actions>
          <Suspense fallback={<Skeleton className="h-7 w-24" />}>
            <EchoSetAddLoader echoId={echoId} />
          </Suspense>
        </EditableSection.Actions>
      </EditableSection.Header>

      <Suspense fallback={<EchoSetsSkeleton />}>
        <EchoSetsContent echoId={echoId} />
      </Suspense>
    </EditableSection.Root>
  )
}
