import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import type { EchoSkillBonusRow } from "@db/schema"
import {
  RESONATOR_ELEMENTS,
  RESONATOR_WEAPON_TYPES,
} from "@game-data/application/constants/resonator"
import { EchoSkillResonatorName } from "@panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-resonator-name"

type EchoSkillBonusConditionTextProps = {
  bonus: EchoSkillBonusRow
}

function optionText(
  options: readonly { label: string; value: string }[],
  value: string
): string {
  return options.find((option) => option.value === value)?.label ?? value
}

/** Human sentence of the bonus condition, with the resolver name if needed. */
export function EchoSkillBonusConditionText({
  bonus,
}: EchoSkillBonusConditionTextProps) {
  if (bonus.condition === "resonator" && bonus.conditionValue) {
    return (
      <>
        Solo si lo lleva{" "}
        <Suspense
          fallback={<Skeleton as="span" className="inline-block h-3 w-17.5" />}
        >
          <EchoSkillResonatorName value={bonus.conditionValue} />
        </Suspense>
        .
      </>
    )
  }

  if (bonus.condition === "element" && bonus.conditionValue) {
    return (
      <>
        Solo con un portador de{" "}
        {optionText(RESONATOR_ELEMENTS, bonus.conditionValue)}.
      </>
    )
  }

  if (bonus.condition === "weaponType" && bonus.conditionValue) {
    return (
      <>
        Solo si el portador usa{" "}
        {optionText(RESONATOR_WEAPON_TYPES, bonus.conditionValue)}.
      </>
    )
  }

  if (bonus.condition === "combat") {
    return <>Solo durante el combate.</>
  }

  return <>Se aplica siempre.</>
}
