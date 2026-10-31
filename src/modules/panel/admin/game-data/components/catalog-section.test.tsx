/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import type { DockItemData } from "@/components/ui/dock"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  linkOptions,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { CatalogSection } from "./catalog-section"

type Item = { id: number; name: string }

const items: Item[] = [
  { id: 1, name: "Yangyang" },
  { id: 2, name: "Rover" },
]

const dockItems: DockItemData[] = [
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin" }),
    label: "Inicio",
    icon: <svg />,
  },
  { label: "Agregar", icon: <svg />, onClick: () => {} },
]

/** `<Link>` needs a router on the server, so the dock renders inside one. */
async function renderInRouter(node: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> })
  const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => node,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([pageRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  })

  await router.load()

  return renderToStaticMarkup(<RouterProvider router={router} />)
}

describe("CatalogSection", () => {
  test("link items need linkOptions, action items need onClick", () => {
    // @ts-expect-error - a link item without linkOptions is not valid
    const invalid: DockItemData = { type: "link", label: "Inicio" }

    expect(invalid).toBeDefined()
  })

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

  test("renders links with the router and actions with a button", async () => {
    const html = await renderInRouter(
      <CatalogSection.DockActions items={dockItems} />
    )

    expect(html).toContain('aria-label="Acciones del catalogo"')
    expect(html).toContain('role="toolbar"')
    expect(html).toContain('aria-label="Inicio"')
    expect(html).toContain('aria-label="Agregar"')
    // Navigation items become router links, actions stay buttons.
    expect(html).toContain('href="/admin"')
    expect(html).toContain('<button type="button"')
    // Theme tokens instead of the dock's built-in palette.
    expect(html).toContain("--dock-accent:var(--primary)")
    // Space reserved for the fixed bar.
    expect(html).toContain("h-24")
  })
})
