import { Badge } from "@/components/ui/badge"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { BuildCardSection } from "../../../ui/build-card-section"

type EchoSlotTriggerProps = {
  slot: EchoesDataProps
}

/** Card that previews one echo slot or its empty state. */
export function EchoSlotTrigger({ slot }: EchoSlotTriggerProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const isMain = build?.mainEchoSlot === slot.index

  return (
    <BuildCardSection hovered className="h-full w-full">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Eco {slot.index + 1}
          </p>
          <Show when={isMain}>
            <Badge variant="secondary">Principal</Badge>
          </Show>
        </div>

        <Show
          when={slot.data}
          fallback={
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
              Seleccionar eco
            </div>
          }
        >
          {(echo) => (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <Image
                src={echo.icon}
                alt={echo.name}
                size="full"
                rounded="xl"
                background="accent"
                className="mx-auto max-w-40"
              />
              <div className="w-full min-w-0 text-center">
                <p className="truncate text-sm font-medium">{echo.name}</p>
                <p className="text-xs text-muted-foreground">
                  Nv. {slot.level} · Costo {slot.cost}
                </p>
              </div>
            </div>
          )}
        </Show>
      </div>
    </BuildCardSection>
  )
}
