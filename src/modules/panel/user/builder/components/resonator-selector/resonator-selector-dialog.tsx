import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SkeletonSuspense } from "skullet/react"
import { useState } from "react"
import { ResonatorGrid } from "@/modules/panel/user/builder/components/resonator-selector/resonator-grid"
import { ResonatorListLoading } from "@/modules/panel/user/builder/components/resonator-selector/resonator-skeletons"
import { useBuilderId } from "@/modules/panel/user/builder/application/use-builder-id"

interface ResonatorSelectorDialogProps {
  trigger: React.ReactNode
}

/** Dialog that picks a resonator with a six-column portrait grid. */
export function ResonatorSelectorDialog({
  trigger,
}: ResonatorSelectorDialogProps) {
  const buildId = useBuilderId()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        nativeButton={false}
        render={<div className="outline-0">{trigger}</div>}
      />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Selecciona un resonador</DialogTitle>
        </DialogHeader>

        <SkeletonSuspense
          skeleton={<ResonatorListLoading columns={6} aspect="portrait" />}
        >
          <ResonatorGrid
            buildId={buildId}
            columns={6}
            aspect="portrait"
            onSelect={() => setIsOpen(false)}
          />
        </SkeletonSuspense>
      </DialogContent>
    </Dialog>
  )
}
