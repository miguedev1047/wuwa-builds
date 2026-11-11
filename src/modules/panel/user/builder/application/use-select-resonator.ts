import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { selectResonatorPatch } from "@builds/application/select-resonator-patch"
import { updateBuild } from "@builds/client/build-store"
import type { CharacterSummary } from "@game-data/domain/character"
import { characterQueries } from "@game-data/queries/characters"

export type ResonatorSelectionResult = "selected" | "unchanged" | "error"

/** Loads a resonator detail and applies it to an existing local build. */
export function useSelectResonator(buildId: string) {
  const queryClient = useQueryClient()

  const selectResonator = async (
    character: CharacterSummary
  ): Promise<ResonatorSelectionResult> => {
    try {
      const detail = await queryClient.query(
        characterQueries.detail(character.id)
      )

      let result: ResonatorSelectionResult = "unchanged"

      updateBuild(buildId, (draft) => {
        const patch = selectResonatorPatch({
          current: draft.resonator,
          character,
          detail,
        })

        if (!patch) return

        result = "selected"
        draft.resonator = patch.resonator

        if (patch.weapon) {
          draft.weapon = patch.weapon
        }

        draft.updateAt = new Date().toISOString()
      })

      return result
    } catch {
      toast.error("No se pudo cargar el resonador")
      return "error"
    }
  }

  const preloadResonator = (character: CharacterSummary) => {
    void queryClient.query(characterQueries.detail(character.id))
  }

  return { selectResonator, preloadResonator }
}
