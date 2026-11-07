import type { ResonatorPassivesDataProps } from "@/modules/builds/domain/build-record"
import { BuildResonatorBonusPill } from "@/modules/panel/user/builder-old/components/build-resonator-bonus-pill"

interface BuildResonatorBonusListProps {
  passives: ResonatorPassivesDataProps[]
}

interface BonusTotal {
  name: string
  icon: string
  value: number
}

/** Sums enabled passives by stat and renders one pill per stat. */
export function BuildResonatorBonusList({
  passives,
}: BuildResonatorBonusListProps) {
  const totals = new Map<string, BonusTotal>()

  for (const passive of passives) {
    const key = passive.name.trim().toUpperCase()
    const current = totals.get(key)

    if (current) {
      current.value += passive.value
    } else {
      totals.set(key, {
        name: passive.name,
        icon: passive.icon,
        value: passive.value,
      })
    }
  }

  const bonuses = [...totals.values()].filter(
    (bonus) => Math.round(bonus.value * 100) > 0
  )

  if (bonuses.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin bonos activos</p>
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {bonuses.map((bonus) => (
        <BuildResonatorBonusPill
          key={bonus.name}
          name={bonus.name}
          icon={bonus.icon}
          value={bonus.value}
        />
      ))}
    </ul>
  )
}
