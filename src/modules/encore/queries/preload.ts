/**
 * Keeps an Encore prefetch from failing a route.
 *
 * Admin detail pages read their data from D1; Encore is only a prefill helper.
 * A timeout, a rate limit or a 404 must not take down the page, so the failure
 * is logged and the caller gets `null`.
 */
export function softPreload<T>(query: Promise<T>): Promise<T | null> {
  return query.catch((error: unknown) => {
    console.error("[encore] prefetch failed", error)

    return null
  })
}
