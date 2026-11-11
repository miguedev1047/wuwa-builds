import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { ResonatorSkillsTree } from "@builder/sections/resonator-section/components/resonator-skills-tree"
import { BuildCardSectionDialog } from "@builder/ui/build-card-section"
import type { BuildProps } from "@builds/domain/build-record"
import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface ResonatorSkillTreeDialogProps {
  build: BuildProps
  resonatorId: number
}

/**
 * Skills and passives dialog of the resonator section.
 *
 * `BuildCardSectionDialog` renders its own trigger button, so the trigger must
 * be content only: nesting a `Button` would put a button inside a button.
 */
export function ResonatorSkillTreeDialog({
  build,
  resonatorId,
}: ResonatorSkillTreeDialogProps) {
  return (
    <BuildCardSectionDialog
      title="Habilidades"
      description="Ajusta los niveles de las habilidades y activa las pasivas del resonador."
      dialogContent={{ size: "lg" }}
      trigger={
        <span
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "pointer-events-none"
          )}
        >
          <HugeiconsIcon icon={StarIcon} />
          Habilidades
        </span>
      }
    >
      {() => <ResonatorSkillsTree build={build} resonatorId={resonatorId} />}
    </BuildCardSectionDialog>
  )
}
