import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db"
import type { BuildProps } from "@build/domain/build-record"

export const buildCollection = createCollection(
  localStorageCollectionOptions<BuildProps>({
    id: "builds",
    storageKey: "builds",
    getKey: (item) => item.buildId,
  })
)
