interface BuildResonatorBonusPillProps {
  name: string
  icon: string
  value: number
}

/** Rounds floating-point sums without trailing zeros (7.999… → 8). */
function formatBonusValue(value: number): string {
  return Number(value.toFixed(2)).toString()
}

/** One summed stat bonus, shown as a compact pill. */
export function BuildResonatorBonusPill({
  name,
  icon,
  value,
}: BuildResonatorBonusPillProps) {
  return (
    <li className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5">
      <img src={icon} alt="" className="size-4 shrink-0 object-contain" />
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {name}
      </span>
      <span className="text-xs font-semibold text-brand-warning">
        +{formatBonusValue(value)}%
      </span>
    </li>
  )
}
