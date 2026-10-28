/**
 * Encore API client with a deliberately modest cache.
 *
 * The API is public and returns localized JSON (`es` by default). To avoid
 * hammering it:
 *
 * - In-flight/5-minute dedupe per Worker isolate.
 * - 6-hour Cloudflare edge cache for subrequests (`cf.cacheTtl`).
 * - Client side, the shared query options use a 6-hour `staleTime`.
 */
const API_BASE = "https://api-v2.encore.moe/api"
const API_LANG = "es"
const MEMORY_TTL_MS = 5 * 60_000
const EDGE_TTL_SECONDS = 6 * 60 * 60
const REQUEST_TIMEOUT_MS = 15_000

interface CacheEntry {
  expiresAt: number
  promise: Promise<unknown>
}

const memory = new Map<string, CacheEntry>()

export function fetchEncoreJson<T>(path: string): Promise<T> {
  const key = path
  const now = Date.now()
  const cached = memory.get(key)

  if (cached && cached.expiresAt > now) {
    return cached.promise as Promise<T>
  }

  const promise = (async () => {
    const response = await fetch(`${API_BASE}/${API_LANG}/${path}`, {
      headers: {
        accept: "application/json",
        "user-agent": "wuwa-builds/1.0",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cf: {
        cacheEverything: true,
        cacheTtl: EDGE_TTL_SECONDS,
      },
    } as RequestInit)

    if (!response.ok) {
      throw new Error(`Encore API ${response.status} for ${path}`)
    }

    return (await response.json()) as T
  })()

  memory.set(key, { expiresAt: now + MEMORY_TTL_MS, promise })

  promise.catch(() => {
    memory.delete(key)
  })

  return promise
}
