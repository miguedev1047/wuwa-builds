import { Button } from "@/components/ui/button"
import { ResonatorSelectorDialog } from "@builder/components/build-card"

/** Compact resonator selector trigger for screens without the portrait. */
export function BuildResonatorAction() {
  return (
    <ResonatorSelectorDialog
      trigger={
        <Button type="button" variant="outline" size="sm">
          Resonador
        </Button>
      }
    />
  )
}
