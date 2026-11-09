import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateBuild } from "@/modules/builds/client/build-store"
import type { WeaponSummary } from "@/modules/game-data/domain/weapon"
import { weaponQueries } from "@/modules/game-data/queries/weapons"

/** Warms the weapon detail and applies the summary to the local build. */
export function useSelectWeapon(buildId: string) {
  const queryClient = useQueryClient()

  const selectWeapon = async (weapon: WeaponSummary): Promise<boolean> => {
    try {
      await queryClient.query(weaponQueries.detail(weapon.id))

      updateBuild(buildId, (draft) => {
        draft.weapon.data = weapon
        draft.updateAt = new Date().toISOString()
      })

      return true
    } catch {
      toast.error("No se pudo cargar el arma")
      return false
    }
  }

  return { selectWeapon }
}
