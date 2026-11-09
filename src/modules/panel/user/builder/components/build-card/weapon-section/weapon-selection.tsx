import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { WeaponPickerDialog } from "./weapon-picker-dialog"

/** Selected weapon summary and the button that opens the weapon picker. */
export function WeaponSelection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const weapon = build?.weapon.data

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
      <Show
        when={weapon}
        fallback={
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Sin arma seleccionada</p>
            <p className="text-xs text-muted-foreground">
              Elige un arma compatible con el resonador.
            </p>
          </div>
        }
      >
        {(selected) => (
          <>
            <Image
              src={selected.icon}
              alt={selected.name}
              size="sm"
              rounded="xl"
              background="accent"
              className="w-16"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{selected.name}</p>
              <p className="text-xs text-muted-foreground">
                {selected.typeName}
              </p>
            </div>
          </>
        )}
      </Show>

      <WeaponPickerDialog label={weapon ? "Cambiar" : "Elegir arma"} />
    </div>
  )
}
