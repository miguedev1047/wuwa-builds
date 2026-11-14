import { isCatalogNotFound } from "@catalog/domain/catalog-error"
import { notFound } from "@tanstack/react-router"

/** Converts a catalog failure to a route-owned 404 during preloading. */
export async function catalogResource<T>(load: Promise<T>): Promise<T> {
  try {
    return await load
  } catch (error) {
    if (isCatalogNotFound(error)) throw notFound()
    throw error
  }
}
