import { createContext, useContext } from "react"

type CommandSearchContextValue = {
  close: () => void
}

export const CommandSearchContext =
  createContext<CommandSearchContextValue | null>(null)

export function useCommandSearch() {
  const context = useContext(CommandSearchContext)

  if (!context) {
    throw new Error(
      "CommandSearch.Item must be rendered inside CommandSearch.Root"
    )
  }

  return context
}
