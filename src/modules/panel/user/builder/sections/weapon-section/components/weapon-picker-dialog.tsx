import type { BuildProps } from "@builds/domain/build-record"
import { WeaponPicker } from "@builder/sections/weapon-section/components/weapon-picker"
import { BuildWorkspace } from "@builder/components/workspace"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { Show } from "@/components/utility/show"

/** Standalone dialog that replaces the weapon of the build. */
export function WeaponPickerDialog({ build }: { build: BuildProps }) {
  const noHasWeaponSelected = !!build.weapon.data
  const hasResonatorSelected = build.resonator.data

  return (
    <Show
      when={hasResonatorSelected}
      fallback={
        <BuildWorkspace.Empty enabled={false}>
          <BuildWorkspace.EmptyTitle title="Primero selecciona un resonador" />
        </BuildWorkspace.Empty>
      }
    >
      <BuildWorkspace.Dialog
        triggerComponent={
          noHasWeaponSelected ? (
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
            </Button>
          ) : (
            <BuildWorkspace.Empty>
              <BuildWorkspace.EmptyTitle title="Seleccionar arma" />
            </BuildWorkspace.Empty>
          )
        }
        title="Selecciona un arma"
        description="Solo se muestran las armas compatibles con el resonador."
      >
        {({ close }) => (
          <WeaponPicker build={build} columns={4} onSelected={close} />
        )}
      </BuildWorkspace.Dialog>
    </Show>
  )
}
