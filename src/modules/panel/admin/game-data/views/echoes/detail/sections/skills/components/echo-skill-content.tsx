import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { echoQueries } from "@/modules/panel/admin/game-data/queries/echoes"
import { EchoSkillBonusList } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-list"
import { EchoSkillText } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-text"

type EchoSkillContentProps = {
  echoId: number
}

/** Suspended skill text and bonus list of the echo. */
export function EchoSkillContent({ echoId }: EchoSkillContentProps) {
  const { data: echo } = useSuspenseQuery(echoQueries.detail(echoId))

  return (
    <EditableSection.Content>
      {echo.skill ? (
        <EchoSkillText skill={echo.skill} />
      ) : (
        <EditableSection.Text>
          Este eco todavía no tiene la habilidad guardada. Impórtala desde
          Encore.
        </EditableSection.Text>
      )}

      <EchoSkillBonusList echoId={echoId} bonuses={echo.skillBonuses} />
    </EditableSection.Content>
  )
}
