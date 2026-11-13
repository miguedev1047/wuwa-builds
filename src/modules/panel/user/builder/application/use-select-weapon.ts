import { buildEdits } from "@builds/application/build-edits"
import { useSessionId } from "@panel/user/builds/application/build-live-queries"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateBuild } from "@builds/client/build-store"
import type { WeaponSummary } from "@game-data/domain/weapon"
import { weaponQueries } from "@game-data/queries/weapons"

/** Warms the weapon detail and applies the summary to the local build. */
export function useSelectWeapon(buildId: string) {
  const queryClient = useQueryClient()
  const identity = { buildId, sessionId: useSessionId() }

  const selectWeapon = async (weapon: WeaponSummary): Promise<boolean> => {
    try {
      await queryClient.query(weaponQueries.detail(weapon.id))

      return updateBuild(identity, (draft) =>
        buildEdits.selectWeapon(draft, weapon)
      )
    } catch {
      toast.error("No se pudo cargar el arma")
      return false
    }
  }

  return { selectWeapon }
}
