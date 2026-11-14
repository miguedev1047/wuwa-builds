import type { EchoSkillBonusRow } from "@db/schema"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSkillBonusCard } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-bonus-card"

type EchoSkillBonusListProps = {
  echoId: number
  bonuses: EchoSkillBonusRow[]
}

/** Bonuses the skill grants, each one editable and deletable. */
export function EchoSkillBonusList({
  echoId,
  bonuses,
}: EchoSkillBonusListProps) {
  return (
    <EditableSection.List
      items={bonuses}
      getItemKey={(bonus) => bonus.id}
      empty={
        <EditableSection.Text>
          La habilidad todavía no tiene bonos.
        </EditableSection.Text>
      }
    >
      {(bonus) => <EchoSkillBonusCard echoId={echoId} bonus={bonus} />}
    </EditableSection.List>
  )
}
