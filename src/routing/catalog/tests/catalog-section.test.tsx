import { ActionDock } from "@/components/blocks/action-dock"
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
import { CatalogSection } from "@catalog/presentation/components/catalog-section"

const dockItems: DockItemData[] = [
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin" }),
    label: "Inicio",
    icon: <svg />,
  },
  { label: "Agregar", icon: <svg />, onClick: () => {} },
  { label: "No disponible", icon: <svg />, disabled: true },
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

/** `cn` reorders the class list, so read the dock container as a whole. */
function dockNavTag(html: string) {
  return html.match(/<nav[^>]*>/)?.[0] ?? ""
}

describe("CatalogSection", () => {
  test("link items need linkOptions, action items need onClick", () => {
    // @ts-expect-error - a link item without linkOptions is not valid
    const invalid: DockItemData = { type: "link", label: "Inicio" }

    expect(invalid).toBeDefined()
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
    const html = await renderInRouter(<ActionDock items={dockItems} />)

    expect(html).toContain('aria-label="Acciones principales"')
    expect(html).toContain('role="toolbar"')
    expect(html).toContain('aria-label="Inicio"')
    expect(html).toContain('aria-label="Agregar"')
    expect(html).toContain('aria-label="No disponible"')
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('disabled=""')
    // Navigation items become router links, actions stay buttons.
    expect(html).toContain('href="/admin"')
    expect(html).toContain('<button type="button"')
    // Theme tokens instead of the dock's built-in palette.
    expect(html).toContain("--dock-accent:var(--primary)")
    // Pinned to the viewport unless a screen asks for container positioning.
    expect(dockNavTag(html)).toContain("fixed")
    expect(dockNavTag(html)).not.toContain("absolute")
    expect(html).toContain("h-action-dock-clearance")
    expect(html).toContain("bottom-action-dock-offset!")
  })

  test("anchors the dock to its container in absolute mode", async () => {
    const html = await renderInRouter(
      <ActionDock items={dockItems} mode="absolute" />
    )

    expect(dockNavTag(html)).toContain("absolute")
    expect(dockNavTag(html)).not.toContain("fixed")
  })

  test("items default to the portrait shape and accept a square one", () => {
    const portrait = renderToStaticMarkup(<CatalogSection.Item />)
    const square = renderToStaticMarkup(<CatalogSection.Item aspect="square" />)

    expect(portrait).toContain("aspect-2/3")
    expect(square).toContain("aspect-square")
    expect(square).not.toContain("aspect-2/3")
  })
})
