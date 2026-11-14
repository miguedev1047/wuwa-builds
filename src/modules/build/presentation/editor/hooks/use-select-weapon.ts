import { buildEdits } from "@build/application/build-edits"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateBuild } from "@build/client/build-store"
import type { WeaponSummary } from "@catalog/domain/weapon"
import { weaponQueries } from "@catalog/queries/weapons"

/** Warms the weapon detail and applies the summary to the local build. */
export function useSelectWeapon(buildId: string) {
  const queryClient = useQueryClient()
  const identity = { buildId, sessionId: useBuildIdentity().sessionId }

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
