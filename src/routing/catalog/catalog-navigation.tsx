import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, useNavigate } from "@tanstack/react-router"
import { CatalogActionsProvider } from "@catalog/presentation/catalog-actions"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

type Entity = "weapons" | "resonators" | "echoes"
type LinkProps = { id: number; children: ReactNode }
const createLabels = {
  weapons: "Agregar arma",
  resonators: "Agregar resonador",
  echoes: "Agregar eco",
}

const detailLinks = {
  weapons: ({ id, children }: LinkProps) => (
    <Link to="/admin/weapons/$id" params={{ id: String(id) }}>
      {children}
    </Link>
  ),
  resonators: ({ id, children }: LinkProps) => (
    <Link to="/admin/resonators/$id" params={{ id: String(id) }}>
      {children}
    </Link>
  ),
  echoes: ({ id, children }: LinkProps) => (
    <Link to="/admin/echoes/$id" params={{ id: String(id) }}>
      {children}
    </Link>
  ),
}

/** Adapts catalog outcomes and links to the application's routes. */
export function CatalogNavigation({
  entity,
  children,
}: {
  entity: Entity
  children: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <CatalogActionsProvider
      actions={{
        DetailLink: detailLinks[entity],
        onCreated: (id) =>
          navigate({ to: `/admin/${entity}/$id`, params: { id: String(id) } }),
        onDeleted: () => navigate({ to: `/admin/${entity}` }),
        createLink: (
          <Button
            nativeButton={false}
            render={
              <Link to={`/admin/${entity}/new`}>
                <HugeiconsIcon icon={PlusIcon} />
                {createLabels[entity]}
              </Link>
            }
          />
        ),
      }}
    >
      {children}
    </CatalogActionsProvider>
  )
}
