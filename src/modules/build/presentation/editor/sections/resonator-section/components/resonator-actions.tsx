import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BuildProps } from "@build/domain/build-record"
import type { CharacterDetail } from "@catalog/domain/character"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDataTransferHorizontalIcon,
  EllipsisIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { useState } from "react"
import { ResonatorChangeDialog } from "@build/presentation/editor/sections/resonator-section/components/resonator-change-dialog"
import { ResonatorSkillsDialog } from "@build/presentation/editor/sections/resonator-section/components/resonator-skills-dialog"

type ResonatorActionsProps = {
  build: BuildProps
  resonator: Pick<CharacterDetail, "id">
}

/** Actions of the resonator section: change the resonator or edit its skills. */
export function ResonatorActions({ build, resonator }: ResonatorActionsProps) {
  const [changeOpen, setChangeOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Acciones del resonador"
            >
              <HugeiconsIcon icon={EllipsisIcon} />
            </Button>
          }
        />

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setChangeOpen(true)}>
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
            Cambiar resonador
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSkillsOpen(true)}>
            <HugeiconsIcon icon={StarIcon} />
            Habilidades
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResonatorChangeDialog
        build={build}
        open={changeOpen}
        onOpenChange={setChangeOpen}
      />

      <ResonatorSkillsDialog
        build={build}
        resonatorId={resonator.id}
        open={skillsOpen}
        onOpenChange={setSkillsOpen}
      />
    </>
  )
}
