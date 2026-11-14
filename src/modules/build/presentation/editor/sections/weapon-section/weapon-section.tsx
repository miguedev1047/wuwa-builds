import type { BuildProps } from "@build/domain/build-record"
import { Suspense } from "react"
import { Show } from "@/components/utility/show"
import { WeaponSectionContent } from "@build/presentation/editor/sections/weapon-section/components/weapon-section-content"
import { WeaponPickerDialog } from "@build/presentation/editor/sections/weapon-section/components/weapon-picker-dialog"
import { WeaponSectionLoading } from "@build/presentation/editor/sections/weapon-section/ui-states"

/** Editable weapon section of the builder. */
export function WeaponEditorSection({ build }: { build: BuildProps }) {
  return (
    <Show when={build}>
      {(currentBuild) => (
        <Show
          when={currentBuild.weapon.data}
          fallback={<WeaponPickerDialog build={currentBuild} />}
        >
          {(weapon) => (
            <Suspense fallback={<WeaponSectionLoading />}>
              <WeaponSectionContent build={currentBuild} weaponId={weapon.id} />
            </Suspense>
          )}
        </Show>
      )}
    </Show>
  )
}
