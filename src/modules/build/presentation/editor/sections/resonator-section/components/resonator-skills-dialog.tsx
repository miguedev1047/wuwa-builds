import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { ResonatorSkillsTree } from "@build/presentation/editor/sections/resonator-section/components/resonator-skills-tree"
import type { BuildProps } from "@build/domain/build-record"

type ResonatorSkillsDialogProps = {
  build: BuildProps
  resonatorId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Dialog that edits the resonator skills and passives. */
export function ResonatorSkillsDialog({
  build,
  resonatorId,
  onOpenChange,
  open,
}: ResonatorSkillsDialogProps) {
  return (
    <BuildWorkspace.Dialog
      dialogProps={{ open, onOpenChange }}
      title="Habilidades del resonador"
      description="Ajusta los niveles de las habilidades y activa o desactiva las pasivas."
    >
      {({ close }) => (
        <ResonatorSkillsTree
          build={build}
          resonatorId={resonatorId}
          onSelect={close}
        />
      )}
    </BuildWorkspace.Dialog>
  )
}
