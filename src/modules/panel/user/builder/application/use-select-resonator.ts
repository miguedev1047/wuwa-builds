import { useSessionId } from "@panel/user/builds/application/build-live-queries"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { selectLocalResonator } from "@builds/client/select-local-resonator"
import type { CharacterSummary } from "@game-data/domain/character"
import { characterQueries } from "@game-data/queries/characters"

export type ResonatorSelectionResult =
  "selected" | "unchanged" | "discarded" | "error"

/** Loads a resonator detail and applies it to an existing local build. */
export function useSelectResonator(buildId: string) {
  const queryClient = useQueryClient()
  const identity = { buildId, sessionId: useSessionId() }

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
