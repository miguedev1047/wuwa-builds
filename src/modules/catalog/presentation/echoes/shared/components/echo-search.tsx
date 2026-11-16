import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { CommandSearch } from "@/components/blocks/command-search"
import type { EncoreEchoSummary } from "@encore/domain/echo"
import { Suspense } from "react"
import { EchoSearchFilters } from "@catalog/presentation/echoes/shared/components/search-filters"
import { useEchoSearchParams } from "@catalog/presentation/echoes/shared/hooks/use-echo-search-params"
import { useEchoesFiltered } from "@catalog/presentation/echoes/shared/hooks/use-echo-filtered"
import { Separator } from "@/components/ui/separator"

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
  const { clearSearchParams, echoName, setEchoName } = useEchoSearchParams()

  return (
    <CommandSearch.Root
      clearSearchParams={clearSearchParams}
      search={echoName ?? ""}
      onSearchChange={(value) => void setEchoName(value || null)}
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
      <CommandSearch.Input placeholder="Nombre o ID del eco">
        <CommandSearch.FilterTrigger />
      </CommandSearch.Input>
      <CommandSearch.FilterContent>
        <EchoSearchFilters />
      </CommandSearch.FilterContent>
      <Separator />
      <CommandSearch.List>
        <Suspense fallback={<CommandSearch.Loading />}>
          <EchoSearchResults selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </CommandSearch.List>
    </CommandSearch.Root>
  )
}

type EchoSearchResultsProps = {
  selectedId?: number | null
  onSelect: (echo: EncoreEchoSummary) => void
}

function EchoSearchResults({ selectedId, onSelect }: EchoSearchResultsProps) {
  const { filteredEchoes: echoes } = useEchoesFiltered()

  return (
    <>
      <CommandSearch.Empty>Sin ecos con ese nombre.</CommandSearch.Empty>
      <Show when={echoes.length > 0}>
        <CommandSearch.Group heading="Ecos">
          {echoes.map((echo) => (
            <CommandSearch.Item
              key={echo.id}
              value={`${echo.name} ${echo.id}`}
              onSelect={() => {
                onSelect(echo)
              }}
              subtitle={selectedId === echo.id ? "Actual" : ""}
              icon={
                <img
                  src={echo.icon}
                  alt={echo.name}
                  className="shrink-0 rounded-sm bg-input/50 object-contain"
                />
              }
            >
              {echo.name}
            </CommandSearch.Item>
          ))}
        </CommandSearch.Group>
      </Show>
    </>
  )
}
