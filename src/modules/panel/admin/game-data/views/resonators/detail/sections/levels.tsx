import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { Show } from "@/components/utility/show"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorLevelAddAction } from "@/modules/panel/admin/game-data/views/resonators/detail/components/add-level-action"
import { ResonatorPropertyLevelDelete } from "@/modules/panel/admin/game-data/views/resonators/detail/components/property-level-delete"
import { ResonatorLevelsSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/ui-states/levels-skeleton"

/** Properties (`resonator_property_levels`) of the resonator. */
export function ResonatorLevelsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Niveles</EditableSection.Title>
        <EditableSection.Description>
          Propiedades base del resonador; el valor y el icono se pueden rellenar
          desde Encore.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense skeleton={<SkeletonBox width="6rem" height={32} />}>
            <ResonatorLevelAddLoader resonatorId={resonatorId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorLevelsSkeleton />}>
        <ResonatorLevelsList resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}

type ResonatorLevelAddLoaderProps = {
  resonatorId: number
}

function ResonatorLevelAddLoader({
  resonatorId,
}: ResonatorLevelAddLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  const isMaxProperties = resonator.properties.length >= 6

  const savedNames = resonator.properties.map((property) => property.name)
  const sortOrder =
    resonator.properties.reduce(
      (max, property) => Math.max(max, property.sortOrder),
      0
    ) + 1

  return (
    <ResonatorLevelAddAction
      resonatorId={resonatorId}
      sortOrder={sortOrder}
      isMaxProperties={isMaxProperties}
      encoreProperties={encoreCharacter.properties}
      savedNames={savedNames}
    />
  )
}

type ResonatorLevelsListProps = {
  resonatorId: number
}

function ResonatorLevelsList({ resonatorId }: ResonatorLevelsListProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.properties}
        getItemKey={(property) => property.id}
        empty={
          <EditableSection.Text>
            Sin propiedades agregadas.
          </EditableSection.Text>
        }
      >
        {(property) => (
          <EditableSection.Item>
            <Show when={property.icon}>
              {(icon) => (
                <EditableSection.ItemMedia variant="image">
                  <img
                    src={icon}
                    alt={property.name}
                    className="size-full object-cover"
                  />
                </EditableSection.ItemMedia>
              )}
            </Show>

            <EditableSection.ItemContent>
              <EditableSection.ItemTitle>
                {property.name}
              </EditableSection.ItemTitle>
              <EditableSection.ItemDescription>
                Valor base: {property.baseValue}
              </EditableSection.ItemDescription>
            </EditableSection.ItemContent>

            <EditableSection.ItemActions>
              <ResonatorPropertyLevelDelete
                propertyLevelId={property.id}
                resonatorId={resonatorId}
              />
            </EditableSection.ItemActions>
          </EditableSection.Item>
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
