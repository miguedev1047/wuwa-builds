import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import type { EncoreEchoSummary } from "@encore/domain/echo"
import { encoreEchoQueries } from "@encore/queries/catalogs"
import { CatalogSearch } from "@catalog/presentation/components/catalog-search"
import { Show } from "@/components/utility/show"

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
          size="xl"
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
            >
              <img
                src={echo.icon}
                alt={echo.name}
                width={28}
                height={28}
                className="shrink-0 rounded-sm bg-accent object-contain"
              />

              <span className="truncate">{echo.name}</span>

              <Show when={selectedId === echo.id}>
                <CatalogSearch.Shortcut>Actual</CatalogSearch.Shortcut>
              </Show>
            </CatalogSearch.Item>
          ))}
        </CatalogSearch.Group>
      </Show>
    </>
  )
}
