import { Suspense } from "react"
import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { WeaponGrid } from "@builder/sections/weapon-section/components/weapon-grid"
import { WeaponSectionContent } from "@builder/sections/weapon-section/components/weapon-section-content"
import { WeaponSectionLoading } from "@builder/sections/weapon-section/ui-states"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/** Editable weapon section of the builder. */
export function WeaponBuilderSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildCardSection>
      <Show when={build}>
        {(currentBuild) => (
          <Show
            when={currentBuild.weapon.data}
            fallback={
              <WeaponGrid
                buildId={currentBuild.buildId}
                columns={8}
                aspect="square"
              />
            }
          >
            {(weapon) => (
              <Suspense fallback={<WeaponSectionLoading />}>
                <WeaponSectionContent
                  build={currentBuild}
                  weaponId={weapon.id}
                />
              </Suspense>
            )}
          </Show>
        )}
      </Show>
    </BuildCardSection>
  )
}
