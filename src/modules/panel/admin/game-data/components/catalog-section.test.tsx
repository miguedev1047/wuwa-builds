/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { CatalogSection } from "./catalog-section"

type Item = { id: number; name: string }

const items: Item[] = [
  { id: 1, name: "Yangyang" },
  { id: 2, name: "Rover" },
]

describe("CatalogSection", () => {
  test("renders one li per item with the requested column count", () => {
    const html = renderToStaticMarkup(
      <CatalogSection.List
        items={items}
        cols={6}
        getItemKey={(item) => item.id}
      >
        {(item) => <li>{item.name}</li>}
      </CatalogSection.List>
    )

    expect(html).toContain("<ul")
    expect(html).toContain("lg:grid-cols-6")
    expect(html).toContain("<li>Yangyang</li>")
    expect(html).toContain("<li>Rover</li>")
  })

  test("renders the empty slot instead of the list", () => {
    const html = renderToStaticMarkup(
      <CatalogSection.List
        items={[] as Item[]}
        empty={
          <CatalogSection.Empty
            title="Sin datos"
            description="Sin resonadores disponibles"
          />
        }
      >
        {(item) => <li>{item.name}</li>}
      </CatalogSection.List>
    )

    expect(html).toContain("Sin datos")
    expect(html).toContain("Sin resonadores disponibles")
    expect(html).not.toContain("<ul")
  })

  test("renders one li per item when only one item remains", () => {
    const html = renderToStaticMarkup(
      <CatalogSection.List
        items={items.filter((item) => item.name === "Rover")}
        empty={<CatalogSection.Empty title="Sin datos" description="Nada" />}
      >
        {(item) => <li>{item.name}</li>}
      </CatalogSection.List>
    )

    expect(html).toContain("<li>Rover</li>")
    expect(html).not.toContain("Sin datos")
  })

  test("renders a semantic section header", () => {
    const html = renderToStaticMarkup(
      <CatalogSection.Root>
        <CatalogSection.Header>
          <CatalogSection.Title>Resonadores</CatalogSection.Title>
          <CatalogSection.Description>Lista</CatalogSection.Description>
          <CatalogSection.Action>
            <button type="button">Nuevo</button>
          </CatalogSection.Action>
        </CatalogSection.Header>
      </CatalogSection.Root>
    )

    expect(html).toContain("<section")
    expect(html).toContain("<h2")
    expect(html).toContain("Resonadores</h2>")
    expect(html).toContain("<p")
    expect(html).toContain('data-slot="catalog-section-action"')
  })
})
