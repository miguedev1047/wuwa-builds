import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { selectLocalResonator } from "@build/client/select-local-resonator"
import type { CharacterSummary } from "@catalog/domain/character"
import { characterQueries } from "@catalog/queries/characters"

export type ResonatorSelectionResult =
  "selected" | "unchanged" | "discarded" | "error"

/** Loads a resonator detail and applies it to an existing local build. */
export function useSelectResonator(buildId: string) {
  const queryClient = useQueryClient()
  const identity = { buildId, sessionId: useBuildIdentity().sessionId }

  const selectResonator = async (
    character: CharacterSummary
  ): Promise<ResonatorSelectionResult> => {
    try {
      return await selectLocalResonator(identity, character, () =>
        queryClient.query(characterQueries.detail(character.id))
      )
    } catch {
      toast.error("No se pudo cargar el resonador")
      return "error"
    }
  }

  return { selectResonator }
}
