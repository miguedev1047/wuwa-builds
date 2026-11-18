import { useToast } from "@/components/panelui/toast"
import { selectLocalResonator } from "@build/client/select-local-resonator"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import type { CharacterSummary } from "@catalog/domain/character"
import { characterQueries } from "@catalog/queries/characters"
import { useQueryClient } from "@tanstack/react-query"

export type ResonatorSelectionResult =
  "selected" | "unchanged" | "discarded" | "error"

/** Loads a resonator detail and applies it to an existing local build. */
export function useSelectResonator() {
  const { buildId, userId } = useBuildIdentity()
  const toast = useToast()
  const queryClient = useQueryClient()
  const identity = { buildId, userId }

  const selectResonator = async (
    character: CharacterSummary
  ): Promise<ResonatorSelectionResult> => {
    try {
      return await selectLocalResonator(identity, character, () =>
        queryClient.query(characterQueries.detail(character.id))
      )
    } catch {
      toast.add({ title: "No se pudo cargar el resonador", type: "error" })
      return "error"
    }
  }

  return { selectResonator }
}
