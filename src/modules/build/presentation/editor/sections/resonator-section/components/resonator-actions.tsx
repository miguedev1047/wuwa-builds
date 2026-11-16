import { Button } from "@/components/panelui/button"

import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { ResonatorPicker } from "@build/presentation/editor/sections/resonator-section/components/resonator-picker"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorActionsProps = {
  build: BuildProps
}

/** Actions of the resonator section: change the resonator or edit its skills. */
export function ResonatorActions({ build }: ResonatorActionsProps) {
  const [open, onOpenChange] = useState(false)

  return (
    <BuildWorkspace.Dialog
      dialogProps={{ open, onOpenChange }}
      title="Selecciona un resonador"
      description="Al cambiar de resonador se reinician las habilidades, pasivas y el arma."
      triggerComponent={
        <Button variant="ghost" size="icon">
          <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
        </Button>
      }
    >
      {() => (
        <ResonatorPicker
          build={build}
          columns={4}
          aspect="portrait"
          onSelected={() => onOpenChange(!open)}
        />
      )}
    </BuildWorkspace.Dialog>
  )
}
