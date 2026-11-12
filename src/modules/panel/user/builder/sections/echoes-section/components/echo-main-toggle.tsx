import { Button } from "@/components/ui/button"

type EchoMainToggleProps = {
  isMain: boolean
  onToggle: () => void
}

/** Marks or clears the main echo of the build. */
export function EchoMainToggle({ isMain, onToggle }: EchoMainToggleProps) {
  return (
    <Button
      type="button"
      variant={isMain ? "secondary" : "outline"}
      size="sm"
      onClick={onToggle}
    >
      {isMain ? "Quitar eco principal" : "Marcar eco principal"}
    </Button>
  )
}
