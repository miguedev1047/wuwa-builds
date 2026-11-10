import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCard } from "@panel/user/builder/ui/build-card"

/** Summary of the weapon assigned to the build. */
export function WeaponSelection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildCard className="bg-input/50 p-3">
      <Show
        when={build?.weapon.data}
        fallback={
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Sin arma seleccionada</p>
            <p className="text-xs text-muted-foreground">
              Elige un arma compatible con el resonador.
            </p>
          </div>
        }
      >
        {(weapon) => (
          <div className="flex items-center gap-4">
            <Image
              src={weapon.icon}
              alt={weapon.name}
              size="sm"
              rounded="xl"
              background="accent"
              className="w-16"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{weapon.name}</p>
              <p className="text-xs text-muted-foreground">{weapon.typeName}</p>
            </div>
          </div>
        )}
      </Show>
    </BuildCard>
  )
}
