import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponRefinementCard } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-card"

type WeaponRefinementsContentProps = {
  weaponId: number
}

/** Suspended list of weapon refinements rendered as cards. */
export function WeaponRefinementsContent({
  weaponId,
}: WeaponRefinementsContentProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={weapon.refinements}
        getItemKey={(refinement) => refinement.id}
        empty={
          <EditableSection.Text>
            Sin refinamientos agregados.
          </EditableSection.Text>
        }
      >
        {(refinement) => (
          <WeaponRefinementCard refinement={refinement} weaponId={weaponId} />
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
