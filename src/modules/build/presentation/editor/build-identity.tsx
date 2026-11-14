import { createContext, useContext, type ReactNode } from "react"

export type BuildIdentity = { buildId: string; sessionId: string }
const IdentityContext = createContext<BuildIdentity | null>(null)

/** Supplies the explicitly resolved identity to nested editor controls. */
export function BuildIdentityProvider({
  identity,
  children,
}: {
  identity: BuildIdentity
  children: ReactNode
}) {
  return <IdentityContext value={identity}>{children}</IdentityContext>
}

/** Reads the identity of the editor currently being rendered. */
export function useBuildIdentity() {
  const identity = useContext(IdentityContext)
  if (!identity) throw new Error("BuildIdentityProvider is required")
  return identity
}
