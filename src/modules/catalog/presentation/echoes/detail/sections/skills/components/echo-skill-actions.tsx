import { useSuspenseQuery } from "@tanstack/react-query"
import { echoQueries } from "@catalog/queries/echoes"
import { EchoSkillBonusAddAction } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-bonus-add-action"
import { EchoSkillTextAction } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-text-action"

type EchoSkillActionsProps = {
  echoId: number
}

/** Header actions of the section: the skill text and a new bonus. */
export function EchoSkillActions({ echoId }: EchoSkillActionsProps) {
  const { data: echo } = useSuspenseQuery(echoQueries.detail(echoId))

  return (
    <>
      <EchoSkillTextAction echoId={echoId} skill={echo.skill} />
      <EchoSkillBonusAddAction echoId={echoId} />
    </>
  )
}
