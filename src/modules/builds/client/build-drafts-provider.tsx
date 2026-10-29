import type { Collection } from "@tanstack/react-db"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { BuildDraft } from "../domain/build-draft"
import { createBuildDraftCollection } from "../infrastructure/local-storage/build-drafts"

export type BuildDraftCollection = Collection<BuildDraft, string>

const BuildDraftCollectionContext = createContext<BuildDraftCollection | null>(
  null
)

/**
 * Browser-local draft collection scoped by authenticated user.
 *
 * The collection is created after mount because localStorage does not exist on
 * the server. Children can render without it and use the hook to know whether
 * local persistence is ready.
 */
export function BuildDraftsProvider({
  scopeId,
  children,
}: {
  scopeId: string
  children: ReactNode
}) {
  const [collection, setCollection] = useState<BuildDraftCollection | null>(
    null
  )

  useEffect(() => {
    const current = createBuildDraftCollection(
      scopeId,
      window.localStorage
    ) as BuildDraftCollection
    setCollection(current)

    return () => {
      current.cleanup()
      setCollection(null)
    }
  }, [scopeId])

  return (
    <BuildDraftCollectionContext.Provider value={collection}>
      {children}
    </BuildDraftCollectionContext.Provider>
  )
}

export function useBuildDraftCollection(): BuildDraftCollection | null {
  return useContext(BuildDraftCollectionContext)
}
