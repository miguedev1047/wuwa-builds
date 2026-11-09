import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { BuildCardSection } from "../../../ui/build-card-section"

/** Card that shows the selected weapon or the empty state. */
export function WeaponTrigger() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const weapon = build?.weapon.data

  return (
    <BuildCardSection hovered className="h-full w-full">
      <div className="flex h-full flex-col gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Arma
        </p>

        <Show
          when={weapon}
          fallback={
            <p className="text-sm text-muted-foreground">Seleccionar arma</p>
          }
        >
          {(selected) => (
            <div className="flex min-h-0 items-center gap-3">
              <Image
                src={selected.icon}
                alt={selected.name}
                size="sm"
                rounded="xl"
                background="accent"
                className="w-16"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.typeName} · Nv. {build?.weapon.level}
                </p>
              </div>
            </div>
          )}
        </Show>
      </div>
    </BuildCardSection>
  )
}
