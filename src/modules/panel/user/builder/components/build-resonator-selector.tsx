import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { useSelectResonator } from "@/modules/panel/user/builder/application/use-select-resonator"
import { ResonatorList } from "@/modules/panel/user/resonator-selector/components/resonator-list"
import { Suspense, useState } from "react"

interface BuildResonatorSelectorProps {
  buildId: string
  currentResonatorId?: number
}

/** Dialog that selects or replaces the resonator of an existing build. */
export function BuildResonatorSelector({
  buildId,
  currentResonatorId,
}: BuildResonatorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { pendingId, selectResonator, preloadResonator } =
    useSelectResonator(buildId)

  const handleSelect = async (character: CharacterSummary) => {
    const success = await selectResonator(character)

    if (success) setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant={currentResonatorId ? "outline" : "default"}>
            {currentResonatorId ? "Cambiar resonador" : "Seleccionar resonador"}
          </Button>
        }
      />

      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Selecciona un resonador</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <Suspense fallback={<Spinner />}>
            <ResonatorList
              pendingId={pendingId}
              onSelect={handleSelect}
              onPreload={preloadResonator}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}
