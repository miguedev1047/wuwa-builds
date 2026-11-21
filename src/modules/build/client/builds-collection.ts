import { buildToPayload } from "@build/application/build-document"
import type { BuildRecord } from "@build/application/ports/build-repository"
import type { BuildPayload } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { collectionOptions, useDbClient } from "@tanstack/react-db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import type { QueryClient } from "@tanstack/react-query"

export interface BuildSaveInput {
  buildId: string
  characterId: number | null
  name: string
  payload: BuildPayload
}

/** Remote operations bound to one user's build collection. */
export interface BuildsSource {
  list: () => Promise<BuildProps[]>
  create: (input: BuildSaveInput) => Promise<BuildRecord>
  update: (input: BuildSaveInput) => Promise<BuildRecord | null>
  remove: (buildId: string) => Promise<boolean>
}

function saveInput(build: BuildProps): BuildSaveInput {
  return {
    buildId: build.buildId,
    characterId: build.resonator.data?.id ?? null,
    name: build.name,
    payload: buildToPayload(build),
  }
}

function serverBuildsSource(
  userId: string,
  queryClient: QueryClient
): BuildsSource {
  return {
    list: async () => {
      const [{ getMyBuilds }, { hydrateBuilds }] = await Promise.all([
        import("@build/server/builds"),
        import("@build/client/hydrate-builds"),
      ])
      const records = await getMyBuilds({ data: { userId } })
      return hydrateBuilds(records, queryClient)
    },
    create: async (input) => {
      const { createBuild } = await import("@build/server/builds")
      return createBuild({ data: { ...input, userId } })
    },
    update: async (input) => {
      const { updateBuild } = await import("@build/server/builds")
      return updateBuild({ data: input })
    },
    remove: async (buildId) => {
      const { deleteBuild } = await import("@build/server/builds")
      return deleteBuild({ data: { buildId } })
    },
  }
}

/** Describes the signed-in user's builds for the router's DbClient. */
export function buildsCollection(
  userId: string,
  sourceOverride?: BuildsSource
) {
  const id = `builds:${userId}`

  return collectionOptions(id, (dbClient) => {
    const queryClient = dbClient.requireDependency<QueryClient>("queryClient")
    const api = sourceOverride ?? serverBuildsSource(userId, queryClient)

    // Each update sends a full document. Preserve edit order without a delay.
    let pendingUpdate = Promise.resolve()

    return queryCollectionOptions<BuildProps>({
      id,
      queryKey: ["builds", userId],
      queryClient,
      staleTime: 30_000,
      getKey: (build) => build.buildId,
      queryFn: api.list,
      onInsert: async ({ transaction, collection }) => {
        for (const { modified } of transaction.mutations) {
          await api.create(saveInput(modified))
        }

        await collection.utils.refetch()
      },
      onUpdate: async ({ transaction, collection }) => {
        const save = pendingUpdate.then(async () => {
          for (const { modified } of transaction.mutations) {
            const record = await api.update(saveInput(modified))

            if (!record) throw new Error("Build not found")
          }
        })

        pendingUpdate = save.catch(() => undefined)
        await save
        await collection.utils.refetch()
      },
      onDelete: async ({ transaction, collection }) => {
        await pendingUpdate

        for (const { key } of transaction.mutations) {
          const removed = await api.remove(String(key))

          if (!removed) throw new Error("Build not found")
        }

        await collection.utils.refetch()
      },
    })
  })
}

/** Resolves the same build collection used by the route loaders. */
export function useBuildsCollection(userId: string) {
  return useDbClient().collection(buildsCollection(userId))
}
