import type { BuildProps } from "@builds/domain/build-record"
import { Suspense } from "react"
import { Show } from "@/components/utility/show"
import { WeaponSectionContent } from "@builder/sections/weapon-section/components/weapon-section-content"
import { WeaponPickerDialog } from "@builder/sections/weapon-section/components/weapon-picker-dialog"
import { WeaponSectionLoading } from "@builder/sections/weapon-section/ui-states"
import { BuildWorkspace } from "@builder/components/workspace"

/** Editable weapon section of the builder. */
export function WeaponBuilderSection({ build }: { build: BuildProps }) {
  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(currentBuild) => (
          <Show
            when={currentBuild.weapon.data}
            fallback={<WeaponPickerDialog build={currentBuild} />}
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
