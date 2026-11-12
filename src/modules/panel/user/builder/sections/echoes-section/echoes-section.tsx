import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { EchoesSectionContent } from "@builder/sections/echoes-section/components/echoes-section-content"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { BuildTextHeader } from "../../ui/build-text-header"

/** Editable echoes section of the builder. */
export function EchoesBuilderSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildCardSection>
      <div className="space-y-4">
        <BuildTextHeader>Ecos</BuildTextHeader>

        <Show when={build}>
          {(current) => <EchoesSectionContent build={current} />}
        </Show>
      </div>
    </BuildCardSection>
  )
}
