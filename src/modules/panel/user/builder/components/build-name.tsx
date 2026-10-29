import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { BuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { eq, useLiveQuery } from "@tanstack/react-db"

interface BuildNameProps {
  draftId: string
  collection: BuildDraftCollection
}

export function BuildName({ draftId, collection }: BuildNameProps) {
  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  if (!draft) return null

  return (
    <Field>
      <FieldLabel className="text-lg" htmlFor="build-name">
        Nombre
      </FieldLabel>

      <Input
        id="build-name"
        value={draft.name}
        onChange={(event) => {
          const name = event.target.value

          collection.update(draftId, (current) => {
            current.name = name
            current.updatedAt = new Date().toISOString()
          })
        }}
      />
    </Field>
  )
}
