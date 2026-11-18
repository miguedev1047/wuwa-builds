import { RouteNavigation } from "@/components/blocks/route-navigation"
import { EchoInfoSection } from "@catalog/presentation/echoes/detail/sections/info"
import { EchoSetsSection } from "@catalog/presentation/echoes/detail/sections/sets"
import { EchoSkillsSection } from "@catalog/presentation/echoes/detail/sections/skills"

export function EchoDetail({ echoId }: { echoId: number }) {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Content className="space-y-10">
        <EchoInfoSection echoId={echoId} />
        <EchoSetsSection echoId={echoId} />
        <EchoSkillsSection echoId={echoId} />
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}
