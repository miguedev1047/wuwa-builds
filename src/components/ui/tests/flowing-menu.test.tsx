/// <reference types="bun" />

import { FlowingMenu } from "@/components/ui/flowing-menu"
import type { FlowingMenuItem } from "@/components/ui/flowing-menu"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  linkOptions,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router"
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import type { ReactNode } from "react"

/** `<Link>` needs a router on the server, so the menu renders inside one. */
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

const items: FlowingMenuItem[] = [
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin/weapons" }),
    text: "Armas",
  },
  { text: "Sonatas", onClick: () => {} },
]

describe("FlowingMenu", () => {
  test("renders link items with the router and actions with a button", async () => {
    const html = await renderInRouter(
      <FlowingMenu items={items} ariaLabel="Secciones del panel" />
    )

    expect(html).toContain('aria-label="Secciones del panel"')
    expect(html).toContain('href="/admin/weapons"')
    expect(html).toContain("<button")
    expect(html).toContain("Armas")
    expect(html).toContain("Sonatas")
  })

  test("marks the active item for the current route", async () => {
    const html = await renderInRouter(
      <FlowingMenu items={items} activeIndex={1} />
    )

    expect(html).toContain('aria-current="page"')
    expect(html.match(/aria-current="page"/g)).toHaveLength(1)
  })
})
