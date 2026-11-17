import { Button } from "@/components/panelui/button"
import { Input } from "@/components/panelui/input"
import { Show } from "@/components/utility/show"
import { CheckIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

/** Shows and edits the active build name. */
export function BuildHeaderActions({
  name,
  onRename,
}: {
  name: string
  onRename: (name: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex w-full items-center justify-between">
      <Show
        when={isEditing}
        fallback={
          <h2 className="text-sm" onDoubleClick={() => setIsEditing(true)}>
            {name}
          </h2>
        }
      >
        <Input.Group className="h-6 max-w-48">
          <Input
            autoFocus
            value={name}
            onBlur={() => setIsEditing(false)}
            onChange={(e) => onRename(e.target.value)}
            placeholder="Nombre de la build"
            onKeyDown={(e) => {
              const key = e.key
              if (key === "Escape" || key === "Enter") {
                setIsEditing(false)
              }
            }}
          />
          <Input.Addon align="end">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Guardar nombre"
              className="size-4"
              onClick={() => setIsEditing(false)}
            >
              <HugeiconsIcon icon={CheckIcon} />
            </Button>
          </Input.Addon>
        </Input.Group>
      </Show>
    </div>
  )
}
