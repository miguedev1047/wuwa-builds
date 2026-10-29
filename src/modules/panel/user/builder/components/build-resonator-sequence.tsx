import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import type { BuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { eq, useLiveQuery } from "@tanstack/react-db"

interface BuildResonatorSequenceProps {
  draftId: string
  collection: BuildDraftCollection
}

export function BuildResonatorSequence({
  collection,
  draftId,
}: BuildResonatorSequenceProps) {
  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  if (!draft) return null

  return (
    <Field>
      <FieldLabel className="text-lg">
        Secuencia - {draft.payload.resonator.sequenceRank}
      </FieldLabel>

      <Slider
        value={draft.payload.resonator.sequenceRank}
        max={6}
        min={0}
        onValueChange={(value) => {
          if (value) {
            collection.update(draftId, (current) => {
              current.payload.resonator.sequenceRank = value as number
            })
          } else {
            collection.update(draftId, (current) => {
              current.payload.resonator.sequenceRank = 0
            })
          }
        }}
      />
    </Field>
  )
}
