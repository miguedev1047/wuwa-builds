/// <reference types="bun" />

import { RouteNavigation } from "@/components/blocks/route-navigation"
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

const items = [
  { id: 1, name: "Yangyang" },
  { id: 2, name: "Rover" },
]

describe("RouteNavigation", () => {
  test("renders the page header with a single h1", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root>
        <RouteNavigation.Header>
          <RouteNavigation.Title>Resonadores</RouteNavigation.Title>
          <RouteNavigation.Description>
            Lista de resonadores creados
          </RouteNavigation.Description>
          <RouteNavigation.Actions>
            <button type="button">Nuevo</button>
          </RouteNavigation.Actions>
        </RouteNavigation.Header>
        <RouteNavigation.Content>contenido</RouteNavigation.Content>
      </RouteNavigation.Root>
    )

    expect(html.match(/<h1/g)).toHaveLength(1)
    expect(html).toContain("Resonadores")
    expect(html).toContain("Lista de resonadores creados")
    expect(html).toContain("Nuevo")
    expect(html).toContain("contenido")
  })

  test("constrains the page column in the compact variant", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root variant="compact">
        <RouteNavigation.Content>contenido</RouteNavigation.Content>
      </RouteNavigation.Root>
    )

    expect(html).toContain('data-variant="compact"')
    expect(html).toContain("max-w-5xl")
  })

  test("lets the page span the viewport in the extended variant", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root variant="extended">
        <RouteNavigation.Content>contenido</RouteNavigation.Content>
      </RouteNavigation.Root>
    )

    expect(html).toContain('data-variant="extended"')
    expect(html).not.toContain("max-w-5xl")
  })

  test("renders nested section headings as h2 without another container", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root variant="extended">
        <RouteNavigation.Content variant="inline">
          <RouteNavigation.Header variant="inline">
            <RouteNavigation.Title as="h2">Por resonador</RouteNavigation.Title>
            <RouteNavigation.Description>
              Agrupadas.
            </RouteNavigation.Description>
          </RouteNavigation.Header>
        </RouteNavigation.Content>
      </RouteNavigation.Root>
    )

    expect(html).toContain("<h2")
    expect(html).not.toContain("<h1")
    expect(html).not.toContain("max-w-5xl")
    expect(html).not.toContain("px-4")
  })

  test("overrides the header container independently", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root variant="extended">
        <RouteNavigation.Header variant="compact">
          <RouteNavigation.Title>Resonadores</RouteNavigation.Title>
        </RouteNavigation.Header>
      </RouteNavigation.Root>
    )

    expect(html).toContain("max-w-5xl")
  })

  test("overrides the container of one part only", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root variant="extended">
        <RouteNavigation.Content variant="compact">
          contenido
        </RouteNavigation.Content>
      </RouteNavigation.Root>
    )

    expect(html).toContain("max-w-5xl")
  })

  test("renders one li per item with the given key", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Root>
        <RouteNavigation.Content>
          <RouteNavigation.List
            items={items}
            getKey={(item) => item.id}
            cols={6}
          >
            {(item) => <li>{item.name}</li>}
          </RouteNavigation.List>
        </RouteNavigation.Content>
      </RouteNavigation.Root>
    )

    expect(html).toContain("lg:grid-cols-6")
    expect(html).toContain("<li>Yangyang</li>")
    expect(html).toContain("<li>Rover</li>")
  })

  test("shows the empty slot instead of an empty grid", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.List
        items={[] as Item[]}
        getKey={(item) => item.id}
        empty={<p>Sin datos</p>}
      >
        {(item) => <li>{item.name}</li>}
      </RouteNavigation.List>
    )

    expect(html).toContain("Sin datos")
    expect(html).not.toContain("<ul")
  })

  test("replaces the grid with placeholders while loading", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.List
        items={items}
        getKey={(item) => item.id}
        loading
        loadingCount={3}
      >
        {(item) => <li>{item.name}</li>}
      </RouteNavigation.List>
    )

    expect(html).toContain('role="status"')
    expect(html).toContain("Cargando contenido")
    expect(html.match(/aspect-2\/3/g)).toHaveLength(3)
    expect(html).not.toContain("Yangyang")
  })

  test("reserves the grid while loading", () => {
    const html = renderToStaticMarkup(
      <RouteNavigation.Loading cols={4} aspect="square" count={2} />
    )

    expect(html).toContain('role="status"')
    expect(html).toContain("lg:grid-cols-4")
    expect(html.match(/aspect-square/g)).toHaveLength(2)
  })
})

type Item = { id: number; name: string }
