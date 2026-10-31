import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "skullet/react"
import { Button } from "@/components/ui/button"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { characterQueries } from "@/modules/encore/queries/characters"
import { CatalogSearch } from "@/modules/panel/admin/game-data/components/catalog-search"

type ResonatorSearchProps = {
  /** Id of the character already applied to the form, if any. */
  selectedId?: number | null
  onSelect: (character: EncoreCharacterSummary) => void
  disabled?: boolean
}

/** Encore character picker used to prefill the resonator form. */
export function ResonatorSearch({
  selectedId,
  onSelect,
  disabled,
}: ResonatorSearchProps) {
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
          Buscar resonador
        </Button>
      }
      title="Buscar resonador"
      description="Copia los datos de un resonador de Encore al formulario."
    >
      <CatalogSearch.Input placeholder="Nombre o ID del resonador" />

      <CatalogSearch.List>
        <ResonatorSearchResults selectedId={selectedId} onSelect={onSelect} />
      </CatalogSearch.List>
    </CatalogSearch.Root>
  )
}

type ResonatorSearchResultsProps = {
  selectedId?: number | null
  onSelect: (character: EncoreCharacterSummary) => void
}

function ResonatorSearchResults({
  selectedId,
  onSelect,
}: ResonatorSearchResultsProps) {
  const { data } = useQuery(characterQueries.list())

  return (
    <Skeleton
      data={data}
      label="Buscando resonadores"
      skeleton={<CatalogSearch.Loading />}
    >
      {(characters) => (
        <>
          <CatalogSearch.Empty>
            Sin resonadores con ese nombre.
          </CatalogSearch.Empty>

          <CatalogSearch.Group heading="Resonadores">
            {characters.map((character) => (
              <CatalogSearch.Item
                key={character.id}
                value={`${character.name} ${character.id}`}
                onSelect={() => onSelect(character)}
              >
                <img
                  src={character.icon}
                  alt={character.name}
                  width={28}
                  height={28}
                  className="aspect-square size-7 shrink-0 rounded-sm bg-accent object-cover"
                />

                <span className="truncate">{character.name}</span>

                {selectedId === character.id ? (
                  <CatalogSearch.Shortcut>Actual</CatalogSearch.Shortcut>
                ) : null}
              </CatalogSearch.Item>
            ))}
          </CatalogSearch.Group>
        </>
      )}
    </Skeleton>
  )
}
