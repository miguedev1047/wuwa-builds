import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateBuild } from "@/modules/builds/client/build-store"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import type { EchoDetail } from "@/modules/game-data/domain/echo"

interface EchoSlotSetSelectorProps {
  echo: EchoesDataProps
  buildId: string
  sets: EchoDetail["sets"]
  isLoading?: boolean
}

/** Sonata set selector for one echo slot. */
export function EchoSlotSetSelector({
  echo,
  buildId,
  sets,
  isLoading = false,
}: EchoSlotSetSelectorProps) {
  const options = sets.map((set) => ({
    label: `${set.name} (${set.setId})`,
    value: String(set.setId),
  }))

  const selectedValue = echo.echoSetId ? String(echo.echoSetId) : null

  const handleValueChange = (value: string | null) => {
    if (!value) return

    const setId = Number(value)

    if (!Number.isFinite(setId)) return

    updateBuild(buildId, (current) => {
      const slot = current.echoes?.[echo.index]

      if (!slot) return

      slot.echoSetId = setId
      current.updateAt = new Date().toISOString()
    })
  }

  return (
    <div className="space-y-2">
      <span className="text-xs text-muted-foreground">Set</span>

      <Select
        items={options}
        value={selectedValue}
        disabled={isLoading || options.length === 0}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              isLoading
                ? "Cargando sets..."
                : options.length === 0
                  ? "Sin sets"
                  : "Selecciona un set"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-3">
                <figure className="size-6 bg-accent">
                  <img
                    src={sets[index].icon}
                    alt={sets[index].name}
                    className="size-full object-contain"
                  />
                </figure>
                <p>{option.label}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
