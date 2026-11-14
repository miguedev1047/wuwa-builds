import { useSuspenseQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponDeleteAction } from "@catalog/presentation/weapons/detail/sections/info/components/weapon-delete-action"
import { WeaponEditAction } from "@catalog/presentation/weapons/detail/sections/info/components/weapon-edit-action"
import { weaponRarityLabel } from "@catalog/application/constants/weapon"

type WeaponInfoContentProps = {
  weaponId: number
}

/** Suspended summary block of the weapon. */
export function WeaponInfoContent({ weaponId }: WeaponInfoContentProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Arma: {weapon.name}</EditableSection.Title>

        <EditableSection.Description>
          Información básica del arma y sus datos de catálogo.
        </EditableSection.Description>

        <EditableSection.Action>
          <WeaponEditAction weapon={weapon} />
          <WeaponDeleteAction weaponId={weaponId} />
        </EditableSection.Action>
      </EditableSection.Header>

      <EditableSection.Content className="flex w-full flex-col items-start gap-4 md:flex-row">
        <Show when={weapon.icon}>
          {(icon) => (
            <CatalogSection.Image
              src={icon}
              alt={weapon.name}
              background="accent"
              size="md"
              aspect="square"
              className="object-contain"
            />
          )}
        </Show>

        <EditableSection.Body>
          <EditableSection.Heading>{weapon.name}</EditableSection.Heading>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{weaponRarityLabel(weapon.rarity)}</Badge>
            <Badge variant="outline">{weapon.typeName}</Badge>
            <Badge variant="outline">ID {weapon.id}</Badge>
          </div>

          <Show when={weapon.description}>
            <EditableSection.Text
              dangerouslySetInnerHTML={{ __html: weapon.description }}
            />
          </Show>
        </EditableSection.Body>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}
