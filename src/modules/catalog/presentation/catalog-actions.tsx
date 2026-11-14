import {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react"

/** Navigation slots and outcomes supplied by the screen's host. */
export type CatalogActions = {
  onCreated: (id: number) => void | Promise<void>
  onDeleted: () => void | Promise<void>
  DetailLink: ComponentType<{ id: number; children: ReactNode }>
  createLink: ReactNode
}
const ActionsContext = createContext<CatalogActions | null>(null)

/** Provides navigation callbacks without coupling catalog controls to URLs. */
export function CatalogActionsProvider({
  actions,
  children,
}: {
  actions: CatalogActions
  children: ReactNode
}) {
  return <ActionsContext value={actions}>{children}</ActionsContext>
}

/** Reads navigation capabilities provided by the host screen. */
export function useCatalogActions() {
  const actions = useContext(ActionsContext)
  if (!actions) throw new Error("CatalogActionsProvider is required")
  return actions
}
