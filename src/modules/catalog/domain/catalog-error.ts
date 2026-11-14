/** Stable error message preserved by the server-function transport. */
export const CATALOG_NOT_FOUND = "Catalog resource not found"

/** Recognizes a missing catalog resource without depending on a router. */
export function isCatalogNotFound(error: unknown): boolean {
  return error instanceof Error && error.message === CATALOG_NOT_FOUND
}
