/// <reference types="bun" />

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router"
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import type { ReactNode } from "react"
import { NavigationApp } from "@/components/blocks/navigation-app"
import { Toast } from "@/components/panelui/toast"
import type { SessionUser } from "@/lib/auth-client"

/**
 * `<Link>` needs a router and the account menu needs the toast manager, so the
 * nav renders inside the same shell the app provides.
 */
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

  return renderToStaticMarkup(
    <Toast.Provider>
      <RouterProvider router={router} />
    </Toast.Provider>
  )
}

function sessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: "user-1",
    name: "Rover",
    email: "rover@example.com",
    emailVerified: false,
    image: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    role: "USER",
    ...overrides,
  }
}

describe("NavigationApp", () => {
  test("offers the sign-in link to anonymous visitors", async () => {
    const html = await renderInRouter(<NavigationApp />)

    expect(html).toContain("Iniciar sesión")
    expect(html).not.toContain(">Admin<")
  })

  test("opens the account menu instead of the sign-in link", async () => {
    const html = await renderInRouter(
      <NavigationApp
        user={sessionUser({ image: "https://cdn.example.com/avatar.png" })}
      />
    )

    // Base UI paints the picture once the browser has loaded it, so the
    // server markup only carries the initials behind the menu trigger.
    expect(html).toContain('data-slot="avatar"')
    expect(html).toContain('aria-label="Menú de cuenta"')
    expect(html).toContain('aria-haspopup="menu"')
    expect(html).not.toContain("Iniciar sesión")
    expect(html).not.toContain(">Admin<")
  })

  test("reveals the admin menu for admins only", async () => {
    const html = await renderInRouter(
      <NavigationApp user={sessionUser({ role: "ADMIN" })} />
    )

    expect(html).toContain(">Admin<")
    expect(html).toContain('aria-label="Menú de cuenta"')
  })
})
