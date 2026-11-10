import { updateBuild } from "@builds/client/build-store"
import { WEAPON_LEVEL_MAX } from "@builds/domain/build"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WEAPON_LEVELS } from "@game-data/application/constants/weapon"

/** Level slider and base properties of the selected weapon. */
export function WeaponLevel() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const level = build?.weapon.level ?? WEAPON_LEVEL_MAX

  const handleLevelChange = (value: number | null) => {
    if (!value) return

    updateBuild(buildId, (draft) => {
      draft.weapon.level = value
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <Field>
      <FieldLabel htmlFor="select-level">Seleccionar nivel</FieldLabel>
      <Select
        id="select-level"
        value={level}
        onValueChange={handleLevelChange}
        items={WEAPON_LEVELS}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WEAPON_LEVELS.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
