import { useSuspenseQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateBuild } from "@builds/client/build-store"
import type { EchoSummary } from "@game-data/domain/echo"
import { echoQueries } from "@game-data/queries/echoes"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"

type EchoSetSelectProps = {
  echo: EchoSummary
  slotIndex: number
}

/** Sonata set selector for one echo slot. */
export function EchoSetSelect({ echo, slotIndex }: EchoSetSelectProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const { data: detail } = useSuspenseQuery(echoQueries.detail(echo.id))

  const slot = build?.echoes.find((entry) => entry.index === slotIndex)
  const options = detail.sets.map((set) => ({
    label: set.name,
    value: String(set.setId),
  }))

  const selectedValue = slot?.echoSetId ? String(slot.echoSetId) : null

  const handleSetChange = (value: string | null) => {
    if (!value) return

    const setId = Number(value)

    if (!Number.isFinite(setId)) return

    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)

      if (!target) return

      target.echoSetId = setId
      draft.updateAt = new Date().toISOString()
    })
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
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
