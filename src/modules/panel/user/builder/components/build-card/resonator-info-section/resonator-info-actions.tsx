import { Show } from "@/components/utility/show"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RESONATOR_LEVELS,
  RESONATOR_SEQUENCE,
} from "@/modules/game-data/application/constants/resonator"
import type { BuildProps } from "@/modules/builds/domain/build-record"
import { updateBuild } from "@/modules/builds/client/build-store"

export function ResonatorInfoActions({ build }: { build: BuildProps }) {
  const handleSelectLevel = (value: number | null) => {
    if (!value) return

    updateBuild(build.buildId, (current) => {
      current.resonator.level = value
    })
  }

  const handleSelectSequency = (value: number | null) => {
    if (!value) {
      updateBuild(build.buildId, (current) => {
        current.resonator.sequency = 0
      })
      return
    }

    updateBuild(build.buildId, (current) => {
      current.resonator.sequency = value
    })
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="select-level">Seleccionar nivel</FieldLabel>
        <Select
          id="select-level"
          value={build.resonator.level}
          onValueChange={handleSelectLevel}
          items={RESONATOR_LEVELS}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESONATOR_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="select-sequency">Seleccionar secuencia</FieldLabel>
        <Select
          id="select-sequency"
          value={build.resonator.sequency}
          onValueChange={handleSelectSequency}
          items={RESONATOR_SEQUENCE}
        >
          <SelectTrigger>
            <SelectValue>
              {(value) => (
                <Show
                  when={value <= 0}
                  fallback={<span>Secuencia {value}</span>}
                >
                  <span>Sin secuencia activa</span>
                </Show>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {RESONATOR_SEQUENCE.map((sequency) => (
              <SelectItem key={sequency.value} value={sequency.value}>
                {sequency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )
}
