import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import {
  createEmptyWeapon,
  createResonatorData,
} from "@/modules/builds/application/factories/build"
import { updateBuild } from "@/modules/builds/client/build-store"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"

/** Loads a resonator detail and applies it to an existing local build. */
export function useSelectResonator(buildId: string) {
  const queryClient = useQueryClient()
  const [pendingId, setPendingId] = useState<number | null>(null)

  const selectResonator = async (
    character: CharacterSummary
  ): Promise<boolean> => {
    setPendingId(character.id)

    try {
      const detail = await queryClient.query(
        characterQueries.detail(character.id)
      )

      updateBuild(buildId, (draft) => {
        const current = draft.resonator.data

        if (current?.id === character.id) return

        draft.resonator = createResonatorData({ character, detail })

        if (current) {
          draft.weapon = createEmptyWeapon()
        }

        draft.updateAt = new Date().toISOString()
      })

      return true
    } catch {
      toast.error("No se pudo cargar el resonador")
      return false
    } finally {
      setPendingId(null)
    }
  }

  const preloadResonator = (character: CharacterSummary) => {
    void queryClient.prefetchQuery(characterQueries.detail(character.id))
  }

  return { pendingId, selectResonator, preloadResonator }
}
