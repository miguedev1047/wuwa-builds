import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { CatalogSearch } from "@catalog/presentation/components/catalog-search"
import type { EncoreEchoSummary } from "@encore/domain/echo"
import { encoreEchoQueries } from "@encore/queries/catalogs"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

type EchoSearchProps = {
  /** Id of the echo already applied to the form, if any. */
  selectedId?: number | null
  onSelect: (echo: EncoreEchoSummary) => void
  disabled?: boolean
}

/** Encore echo picker used to prefill the echo form. */
export function EchoSearch({
  selectedId,
  onSelect,
  disabled,
}: EchoSearchProps) {
  return (
    <CatalogSearch.Root
      trigger={
        <Button
          variant="secondary"
          size="lg"
          type="button"
          className="w-full"
          disabled={disabled}
        >
          Buscar eco
        </Button>
      }
      title="Buscar eco"
      description="Copia los datos de un eco de Encore al formulario."
    >
      <CatalogSearch.Input placeholder="Nombre o ID del eco" />
      <CatalogSearch.List>
        <Suspense fallback={<CatalogSearch.Loading />}>
          <EchoSearchResults selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </CatalogSearch.List>
    </CatalogSearch.Root>
  )
}

type EchoSearchResultsProps = {
  selectedId?: number | null
  onSelect: (echo: EncoreEchoSummary) => void
}

function EchoSearchResults({ selectedId, onSelect }: EchoSearchResultsProps) {
  const { data: echoes } = useSuspenseQuery(encoreEchoQueries.list())

  return (
    <>
      <CatalogSearch.Empty>Sin ecos con ese nombre.</CatalogSearch.Empty>

      <Show when={echoes.length > 0}>
        <CatalogSearch.Group heading="Ecos">
          {echoes.map((echo) => (
            <CatalogSearch.Item
              key={echo.id}
              value={`${echo.name} ${echo.id}`}
              onSelect={() => onSelect(echo)}
              icon={
                <img
                  src={echo.icon}
                  alt={echo.name}
                  className="shrink-0 rounded-sm bg-input/50 object-contain"
                />
              }
            >
              <span className="truncate">{echo.name}</span>

              <Show when={selectedId === echo.id}>
                <span className="ml-auto text-xs text-muted-foreground">
                  Actual
                </span>
              </Show>
            </CatalogSearch.Item>
          ))}
        </CatalogSearch.Group>
      </Show>
    </>
  )
}
