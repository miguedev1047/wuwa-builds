import { Button } from "@/components/panelui/button"
import { Input } from "@/components/panelui/input"
import { Show } from "@/components/utility/show"
import { BuildName } from "@build/presentation/editor/components/workspace/build-name"
import { CheckIcon, PencilEdit01Icon } from "@hugeicons/core-free-icons"
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
    <div className="flex w-full min-w-0 items-center justify-between">
      <Show
        when={isEditing}
        fallback={
          <h2 className="min-w-0 text-sm">
            <button
              type="button"
              aria-label={`Editar nombre de la build ${name}`}
              className="group/build-name flex h-6 max-w-full cursor-pointer items-center gap-1.5 rounded-sm text-start focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none [&>svg]:size-3.5"
              onClick={() => setIsEditing(true)}
            >
              <span className="truncate">{name}</span>
              <HugeiconsIcon
                icon={PencilEdit01Icon}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground opacity-0 group-hover/build-name:opacity-100 group-focus-visible/build-name:opacity-100 [@media(hover:none)]:opacity-100"
              />
            </button>
          </h2>
        }
      >
        <Input.Group
          className="h-6 max-w-48"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsEditing(false)
            }
          }}
        >
          <BuildName name={name} onRename={onRename} autoFocus />
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
