import { useToast } from "@/components/panelui/toast"
import { buildEdits } from "@build/application/build-edits"
import { useBuildStore } from "@build/client/hooks/use-build-store"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import type { WeaponSummary } from "@catalog/domain/weapon"
import { weaponQueries } from "@catalog/queries/weapons"
import { useQueryClient } from "@tanstack/react-query"

/** Warms the weapon detail and applies the summary to the current build. */
export function useSelectWeapon() {
  const { buildId, userId } = useBuildIdentity()
  const { update } = useBuildStore(userId)
  const toast = useToast()
  const queryClient = useQueryClient()
  const identity = { buildId, userId }

  const selectWeapon = async (weapon: WeaponSummary): Promise<boolean> => {
    try {
      await queryClient.query(weaponQueries.detail(weapon.id))

      return update(identity, (draft) => buildEdits.selectWeapon(draft, weapon))
    } catch {
      toast.add({ title: "No se pudo cargar el arma", type: "error" })
      return false
    }
  }

  return { selectWeapon }
}
