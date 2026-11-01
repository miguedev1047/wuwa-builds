import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { Skeleton } from "skullet/react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"

export function ResonatorInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const { data } = useQuery({
    ...characterQueries.detail(resonatorId),
    enabled: Number.isInteger(resonatorId) && resonatorId > 0,
  })

  return (
    <Skeleton data={data} skeleton={<div className="h-40" />}>
      {(resonator) => (
        <CatalogSection.Root>
          <CatalogSection.Header>
            <CatalogSection.Title>
              Resonador: {resonator.name}
            </CatalogSection.Title>
          </CatalogSection.Header>

          <CatalogSection.Content className="bg-card p-4">
            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
              <figure className="shrink-0 overflow-hidden bg-accent max-[480px]:w-full sm:aspect-2/3">
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
  )
}
