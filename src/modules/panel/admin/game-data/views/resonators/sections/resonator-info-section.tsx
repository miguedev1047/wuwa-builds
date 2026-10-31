import { useQuery } from "@tanstack/react-query"
import { characterQueries as wuwaBuildsCharacterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { useParams } from "@tanstack/react-router"
import { Skeleton } from "skullet/react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { ResonatorEditDialog } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-edit-dialog"
import { ResonatorDeleteDialog } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-delete-dialog"

export function ResonatorInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const { data } = useQuery(wuwaBuildsCharacterQueries.detail(parseInt(id)))

  return (
    <>
      <Skeleton data={data} id="resonator-info">
        {(resonator) => (
          <CatalogSection.Root>
            <CatalogSection.Header>
              <CatalogSection.Title>
                Resonador: {resonator.name}
              </CatalogSection.Title>
            </CatalogSection.Header>

            <CatalogSection.Content className="bg-card p-4">
              <div className="flex w-full items-start gap-4">
                <figure className="aspect-2/3 shrink-0 overflow-hidden bg-accent">
                  <CatalogSection.Image
                    src={resonator.iconLarge}
                    alt={resonator.name}
                    className="size-full object-cover"
                  />
                </figure>
                <div className="flex flex-1">
                  <div className="space-y-1">
                    <h2 className="font-mono text-5xl font-bold">
                      {resonator.name}
                    </h2>
                    <p
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: resonator.introduction,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CatalogSection.Content>
          </CatalogSection.Root>
        )}
      </Skeleton>

      <ResonatorEditDialog />
      <ResonatorDeleteDialog />
    </>
  )
}
