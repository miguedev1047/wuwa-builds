import { Show } from "@/components/utility/show"
import { resolveResonatorBonuses } from "@builds/application/calculation/resonator-bonuses"
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"
import { ResonatorBonusPill } from "@builder/sections/resonator-section/components/resonator-bonus-pill"

interface ResonatorBonusListProps {
  passives: ResonatorPassivesDataProps[]
}

/** One pill per stat the enabled passives add up to. */
export function ResonatorBonusList({ passives }: ResonatorBonusListProps) {
  const bonuses = resolveResonatorBonuses(passives)

  return (
    <Show
      when={bonuses.length > 0}
      fallback={
        <p className="text-sm text-muted-foreground">Sin bonos activos</p>
      }
    >
      <ul className="flex flex-wrap gap-2">
        {bonuses.map((bonus) => (
          <ResonatorBonusPill
            key={bonus.statId ?? bonus.name}
            name={bonus.name}
            icon={bonus.icon}
            value={bonus.value}
          />
        ))}
      </ul>
    </Show>
  )
}
