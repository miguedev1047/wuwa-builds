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
  BuildRouteError,
  BuildRouteNotFound,
  BuildRoutePending,
} from "@/routing/build/route-state"

/** The states link back to the library, so they render inside a router. */
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

describe("builder route states", () => {
  test("waits with a full-height status region", () => {
    const html = renderToStaticMarkup(<BuildRoutePending />)

    expect(html).toContain('role="status"')
    expect(html).toContain("Cargando build")
    expect(html).toContain("h-svh")
  })

  test("not found explains the owner and links back to the library", async () => {
    const html = await renderInRouter(<BuildRouteNotFound />)

    expect(html).toContain("Build no encontrada")
    expect(html).toContain("La build no existe.")
    expect(html).toContain('href="/panel/my-builds"')
    expect(html).toContain("Volver a mis builds")
  })

  test("error shows the message, retry and the way back", async () => {
    const html = await renderInRouter(
      <BuildRouteError
        error={new Error("Fallo al leer la colección")}
        reset={() => {}}
      />
    )

    expect(html).toContain("No se pudo cargar la build")
    expect(html).toContain("Fallo al leer la colección")
    expect(html).toContain("Reintentar")
    expect(html).toContain('href="/panel/my-builds"')
  })
})
