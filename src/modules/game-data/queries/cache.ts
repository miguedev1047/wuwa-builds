/**
 * The canonical catalog is shared by the admin panel and the builder and changes
 * whenever an admin edits a row, so it revalidates sooner than immutable data.
 */
export const WUWA_BUILDS_STALE_TIME = 5 * 60 * 1000
export const WUWA_BUILDS_GC_TIME = 24 * 60 * 60 * 1000
