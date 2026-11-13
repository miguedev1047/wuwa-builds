import type { EchoesDataProps } from "@builds/domain/build-record"
import { BuildWorkspace } from "@builder/components/workspace"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"

type EchoSelectionProps = {
  slot: EchoesDataProps
}

/** Summary of the echo assigned to one slot. */
export function EchoSelection({ slot }: EchoSelectionProps) {
  return (
    <BuildWorkspace.Card cardColor="input" className="p-3">
      <Show
        when={slot.data}
        fallback={
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Sin eco seleccionado</p>
            <p className="text-xs text-muted-foreground">
              Elige un eco para este slot.
            </p>
          </div>
        }
      >
        {(echo) => (
          <div className="flex items-center gap-4">
            <Image
              src={echo.icon}
              alt={echo.name}
              size="sm"
              rounded="xl"
              background="accent"
              className="w-16"
            />
            <div className="min-w-0 flex-1">
              <BuildWorkspace.Text size="sm" className="truncate">
                {echo.name}
              </BuildWorkspace.Text>
              <p className="text-xs text-muted-foreground">Costo {echo.cost}</p>
            </div>
          </div>
        )}
      </Show>
    </BuildWorkspace.Card>
  )
}
