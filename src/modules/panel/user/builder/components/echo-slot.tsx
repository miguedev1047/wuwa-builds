import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import type { EchoDetail } from "@/modules/game-data/domain/echo"
import { EchoesList } from "@/modules/panel/user/builder/components/echoes-list"
import { EchoSlotLevelSelector } from "@/modules/panel/user/builder/components/echo-slot-level-selector"
import { EchoSlotMainStatSelector } from "@/modules/panel/user/builder/components/echo-slot-main-stat-selector"
import { EchoSlotSetSelector } from "@/modules/panel/user/builder/components/echo-slot-set-selector"
import { EchoSlotSubstatsSelector } from "@/modules/panel/user/builder/components/echo-slot-substats-selector"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense, useState } from "react"

interface EchoSlotProps {
  echo: EchoesDataProps
  buildId: string
  echoDetail?: EchoDetail
  isLoadingEchoDetail?: boolean
}

/** One echo slot: add button when empty, selected echo preview otherwise. */
export function EchoSlot({
  echo,
  buildId,
  echoDetail,
  isLoadingEchoDetail,
}: EchoSlotProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-start gap-4">
        <DialogTrigger
          render={
            <div className="shrink-0">
              <Show
                when={echo.data}
                fallback={
                  <Button className="size-40">
                    <HugeiconsIcon icon={PlusIcon} className="size-8" />
                  </Button>
                }
              >
                {(echoSelected) => (
                  <figure
                    className="size-40 overflow-hidden bg-accent"
                    role="button"
                  >
                    <img
                      src={echoSelected.icon}
                      alt={echoSelected.name}
                      className="size-full object-contain transition-transform hover:scale-110"
                    />
                  </figure>
                )}
              </Show>
            </div>
          }
        />

        <Show when={echo.data}>
          {(echoSelected) => (
            <div className="w-full space-y-4">
              <h2 className="font-bold">{echoSelected.name}</h2>

              <div className="flex items-center gap-1">
                <Badge variant="outline">Slot: {echo.index + 1}</Badge>
                <Badge variant="outline">Costo: {echo.cost}</Badge>
              </div>

              <EchoSlotSetSelector
                buildId={buildId}
                echo={echo}
                sets={echoDetail?.sets ?? []}
                isLoading={isLoadingEchoDetail}
              />

              <EchoSlotMainStatSelector buildId={buildId} echo={echo} />

              <Show when={echo.mainStatLabel}>
                <EchoSlotLevelSelector buildId={buildId} echo={echo} />
              </Show>

              <EchoSlotSubstatsSelector buildId={buildId} echo={echo} />
            </div>
          )}
        </Show>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecciona un eco</DialogTitle>
        </DialogHeader>

        <Suspense fallback={<Spinner />}>
          <EchoesList
            echoSlot={echo}
            buildId={buildId}
            onSelect={() => setIsOpen(false)}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
