import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import type { BuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { statLabel } from "@/modules/game-data/application/stats/stats"
import { growthValue } from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { eq, useLiveQuery } from "@tanstack/react-db"
import { useQuery } from "@tanstack/react-query"

interface BuildResonatorLevelProps {
  draftId: string
  collection: BuildDraftCollection
}

export function BuildResonatorLevel({
  collection,
  draftId,
}: BuildResonatorLevelProps) {
  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  const { data: character, isLoading } = useQuery({
    ...characterQueries.detail(draft?.characterId ?? 0),
    enabled: draft?.characterId !== undefined,
  })

  if (!draft) return null

  return (
    <Field>
      <FieldLabel className="text-lg">
        Nivel - {draft.payload.resonator.level * 10}
      </FieldLabel>

      <Slider
        value={draft.payload.resonator.level}
        max={10}
        min={1}
        onValueChange={(value) => {
          if (value) {
            collection.update(draftId, (current) => {
              current.payload.resonator.level = value as number
            })
          }
        }}
      />

      <Show when={!isLoading} fallback={<Spinner />}>
        <Show
          when={character?.properties}
          fallback={<p>Este resonador no tiene niveles</p>}
        >
          {(properties) => (
            <>
              <ul className="mt-4 grid gap-2">
                {properties.map((item) => (
                  <li key={item.name}>
                    <p className="text-xs">
                      {statLabel(item.name)} -{" "}
                      {growthValue(
                        item.growth[draft.payload.resonator.level - 1]
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Show>
      </Show>
    </Field>
  )
}
