import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Show } from "@/components/utility/show"
import type { EchoDetail } from "@game-data/domain/echo"

type EchoSetSelectProps = {
  /** Sonata sets the selected echo can roll. */
  sets: EchoDetail["sets"]
  selectedSetId: number | null
  onChange: (setId: number) => void
}

/** Sonata set selector for one echo slot. */
export function EchoSetSelect({
  sets,
  selectedSetId,
  onChange,
}: EchoSetSelectProps) {
  const options = sets.map((set) => ({
    label: set.name,
    value: String(set.setId),
    icon: set.icon,
  }))

  const selectedValue = selectedSetId ? String(selectedSetId) : null

  const handleSetChange = (value: string | null) => {
    if (!value) return

    const setId = Number(value)

    if (Number.isFinite(setId)) onChange(setId)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Set</p>

      <Select
        items={options}
        value={selectedValue}
        disabled={options.length === 0}
        onValueChange={handleSetChange}
      >
        <SelectTrigger className="w-full" aria-label="Set del eco">
          <SelectValue
            placeholder={
              options.length === 0 ? "Sin sets" : "Selecciona un set"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Show when={option.icon}>
                  {(icon) => (
                    <img
                      className="size-5 rounded-full"
                      src={icon}
                      alt={option.label}
                    />
                  )}
                </Show>
                <p>{option.label}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
