import { useSuspenseQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Show } from "@/components/utility/show"
import { updateBuild } from "@builds/client/build-store"
import type { EchoSummary } from "@game-data/domain/echo"
import { echoQueries } from "@game-data/queries/echoes"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { SkeletonSuspense } from "skullet/react"
import { EchoSetSelectSkeleton } from "@builder/components/build-card/echo-slots-section"

type EchoSetSelectProps = {
  echo: EchoSummary
  slotIndex: number
}

export function EchoSetSelect(props: EchoSetSelectProps) {
  return (
    <SkeletonSuspense skeleton={<EchoSetSelectSkeleton />}>
      <EchoSetSelectLoaded {...props} />
    </SkeletonSuspense>
  )
}

/** Sonata set selector for one echo slot. */
export function EchoSetSelectLoaded({ echo, slotIndex }: EchoSetSelectProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const { data: detail } = useSuspenseQuery(echoQueries.detail(echo.id))

  const slot = build?.echoes.find((entry) => entry.index === slotIndex)
  const options = detail.sets.map((set) => ({
    label: set.name,
    value: String(set.setId),
    icon: set.icon,
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
