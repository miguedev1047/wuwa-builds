/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import type { ReactNode } from "react"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router"
import {
  RouteError,
  RouteNotFound,
} from "@/modules/panel/admin/game-data/components/route-state"
import {
  CatalogDetailRouteSkeleton,
  CatalogListRouteSkeleton,
} from "@/modules/panel/admin/game-data/components/route-skeleton"

/** `<Link>` needs a router on the server, so the state renders inside one. */
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

describe("route states", () => {
  test("list skeleton mirrors the catalog list layout", () => {
    const html = renderToStaticMarkup(
      <CatalogListRouteSkeleton
        title="Armas"
        description="Lista de armas creadas"
        cols={6}
        aspect="square"
        count={12}
      />
    )

    expect(html).toContain("Armas")
    expect(html).toContain("Lista de armas creadas")
    expect(html).toContain('role="status"')
    expect(html).toContain("lg:grid-cols-6")
    expect(html.match(/aspect-square/g)).toHaveLength(12)
    expect(html).not.toContain('data-slot="catalog-section-action"')
  })

  test("list skeleton reserves the header actions", () => {
    const html = renderToStaticMarkup(
      <CatalogListRouteSkeleton
        title="Efectos de sonata"
        description="Sets de eco"
        cols={4}
        aspect="portrait"
        count={4}
        actionCount={2}
      />
    )

    expect(html).toContain('data-slot="catalog-section-action"')
    expect(html.match(/aspect-2\/3/g)).toHaveLength(4)
  })

  test("detail skeleton grows with the section count", () => {
    const compact = renderToStaticMarkup(
      <CatalogDetailRouteSkeleton sections={0} />
    )
    const full = renderToStaticMarkup(
      <CatalogDetailRouteSkeleton sections={3} />
    )

    expect(full.length).toBeGreaterThan(compact.length)
    expect(full).toContain("space-y-10")
  })

  test("error state shows the message and retry action", async () => {
    const html = await renderInRouter(
      <RouteError error={new Error("Fallo de red")} reset={() => {}} />
    )

    expect(html).toContain("No se pudo cargar la pagina")
    expect(html).toContain("Fallo de red")
    expect(html).toContain("Reintentar")
    expect(html).toContain('href="/admin"')
  })

  test("not found state links back to the panel", async () => {
    const html = await renderInRouter(<RouteNotFound />)

    expect(html).toContain("No encontrado")
    expect(html).toContain('href="/admin"')
  })
})
