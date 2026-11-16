/// <reference types="bun" />

import { CatalogSearch } from "@catalog/presentation/components/catalog-search"
import { CommandSearch } from "@/components/blocks/command-search"
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

describe("CatalogSearch", () => {
  test("keeps the legacy export as the shared CommandSearch compound API", () => {
    expect(CatalogSearch).toBe(CommandSearch)
  })

  test("renders the trigger element", () => {
    const html = renderToStaticMarkup(
      <CatalogSearch.Root
        trigger={<button type="button">Buscar resonador</button>}
        title="Buscar resonador"
        clearSearchParams={() => undefined}
      >
        <CatalogSearch.Input placeholder="Nombre o ID" />
      </CatalogSearch.Root>
    )

    expect(html).toContain("Buscar resonador")
    expect(html).toContain('aria-haspopup="dialog"')
  })

  test("items must be rendered inside the root", () => {
    expect(() =>
      renderToStaticMarkup(
        <CatalogSearch.Item value="Yangyang">Yangyang</CatalogSearch.Item>
      )
    ).toThrow("CommandSearch.Item must be rendered inside CommandSearch.Root")
  })
})
