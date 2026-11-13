import { Suspense } from "react"
import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { WeaponSectionContent } from "@builder/sections/weapon-section/components/weapon-section-content"
import { WeaponPickerDialog } from "@builder/sections/weapon-section/components/weapon-picker-dialog"
import { WeaponSectionLoading } from "@builder/sections/weapon-section/ui-states"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { BuildWorkspace } from "@builder/components/workspace"

/** Editable weapon section of the builder. */
export function WeaponBuilderSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(currentBuild) => (
          <Show
            when={currentBuild.weapon.data}
            fallback={<WeaponPickerDialog />}
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
    </BuildWorkspace.Card>
  )
}
