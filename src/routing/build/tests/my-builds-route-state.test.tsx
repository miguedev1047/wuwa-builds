/// <reference types="bun" />

import { renderToStaticMarkup } from "react-dom/server"
import type { ReactNode } from "react"
import { describe, expect, test } from "bun:test"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router"
import {
  MyBuildsRouteError,
  MyBuildsRouteNotFound,
  MyBuildsRoutePending,
} from "@/routing/build/my-builds-route-state"

/** The states hold links, so they render inside a router. */
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

describe("my builds route states", () => {
  test("waits with a full-height status region", () => {
    const html = renderToStaticMarkup(<MyBuildsRoutePending />)

    expect(html).toContain('role="status"')
    expect(html).toContain("Cargando builds")
    expect(html).toContain("h-svh")
    expect(html).not.toContain("Mis builds")
  })

  test("not found offers a way home", async () => {
    const html = await renderInRouter(<MyBuildsRouteNotFound />)

    expect(html).toContain("No se encontró la página")
    expect(html).toContain("La sección que buscas no existe.")
    expect(html).toContain('href="/"')
    expect(html).toContain("Ir al inicio")
    expect(html).not.toContain('href="/panel/my-builds"')
  })

  test("error shows the message, retry and the way home", async () => {
    const html = await renderInRouter(
      <MyBuildsRouteError
        error={new Error("Fallo al leer la colección")}
        reset={() => {}}
      />
    )

    expect(html).toContain("No se pudieron cargar las builds")
    expect(html).toContain("Fallo al leer la colección")
    expect(html).toContain("Reintentar")
    expect(html).toContain('href="/"')
    expect(html).not.toContain('href="/panel/my-builds"')
  })
})
