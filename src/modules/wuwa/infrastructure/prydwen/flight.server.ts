/**
 * Parser for the React Server Components (RSC) flight payload that Next.js
 * streams with every page of prydwen.gg.
 *
 * The site has no public data API: the exact props used by its client
 * components (`character`, `weaponBuilds`, `echoBuilds`, ...) are embedded as
 * plain JSON inside `self.__next_f.push(...)` calls. Reading that payload is
 * far more stable than scraping the rendered DOM.
 */
import { Buffer } from "node:buffer"

/** Rebuilds the flight stream from the inline `self.__next_f.push` scripts. */
export function readFlight(html: string): string {
  const chunks: string[] = []
  const script = /self\.__next_f\.push\((\[[\s\S]*?)\)<\/script>/g

  for (const match of html.matchAll(script)) {
    try {
      const payload = JSON.parse(match[1]) as unknown[]
      for (const value of payload) {
        if (typeof value === "string") chunks.push(value)
      }
    } catch {
      // A malformed chunk is not fatal: the others still carry the payload.
    }
  }

  return chunks.join("")
}

/**
 * Long texts (`review`, `rotations`, ...) are stored as separate rows
 * (`<id>:T<byteLength>,<text>`) and referenced from the JSON as `"$<id>"`.
 */
export function createTextLookup(flight: string) {
  const buffer = Buffer.from(flight, "utf8")
  const cache = new Map<string, string | null>()

  return (id: string): string | null => {
    const cached = cache.get(id)
    if (cached !== undefined) return cached

    let text: string | null = null
    const marker = `${id}:T`
    const markerAt = flight.indexOf(marker)

    if (markerAt !== -1) {
      const lengthMatch = /^([0-9a-f]+),/.exec(
        flight.slice(markerAt + marker.length)
      )

      if (lengthMatch) {
        const bytes = Number.parseInt(lengthMatch[1], 16)
        const startChar = markerAt + marker.length + lengthMatch[0].length
        const startByte = Buffer.byteLength(flight.slice(0, startChar), "utf8")
        const raw = buffer
          .subarray(startByte, startByte + bytes)
          .toString("utf8")

        text = raw
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">")
          .replace(/\\u0026/g, "&")
      }
    }

    cache.set(id, text)
    return text
  }
}

/** Replaces `"$<id>"` references with the text row they point to. */
export function resolveTextRefs(
  value: unknown,
  lookup: (id: string) => string | null
): unknown {
  if (typeof value === "string") {
    const match = /^\$([0-9a-f]+)$/.exec(value)
    return (match && lookup(match[1])) || value
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveTextRefs(item, lookup))
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        resolveTextRefs(item, lookup),
      ])
    )
  }

  return value
}

/** Returns the raw JSON slice of a balanced object/array starting at `start`. */
function sliceBalanced(source: string, start: number): string | null {
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = start; index < source.length; index++) {
    const char = source[index]

    if (inString) {
      if (escaped) escaped = false
      else if (char === "\\") escaped = true
      else if (char === '"') inString = false
      continue
    }

    if (char === '"') inString = true
    else if (char === "{" || char === "[") depth++
    else if (char === "}" || char === "]") {
      depth--
      if (depth === 0) return source.slice(start, index + 1)
    }
  }

  return null
}

/**
 * The payload is serialized as `[...,null,{"character":{...},...}]`. We locate
 * the `character` key and walk outwards to the enclosing object.
 */
export function extractPayload(flight: string): Record<string, unknown> | null {
  const needle = '"character":{"id"'
  const anchor = flight.indexOf(needle)
  if (anchor === -1) return null

  const candidates: number[] = []
  for (let index = anchor; index >= 0 && candidates.length < 500; index--) {
    if (flight[index] === "{") candidates.push(index)
  }

  for (const start of candidates) {
    const raw = sliceBalanced(flight, start)
    if (!raw || !raw.includes(needle)) continue

    try {
      const payload = JSON.parse(raw) as Record<string, unknown>
      const character = payload.character as { slug?: unknown } | undefined
      if (typeof character?.slug === "string") return payload
    } catch {
      // Not the enclosing object yet: keep walking outwards.
    }
  }

  return null
}

export interface PagePayload {
  payload: Record<string, unknown>
  ratings: unknown[]
}

/** Parses a character detail page and resolves its text references. */
export function parseCharacterPage(html: string): PagePayload | null {
  const flight = readFlight(html)
  const payload = extractPayload(flight)
  if (!payload) return null

  const resolved = resolveTextRefs(payload, createTextLookup(flight)) as Record<
    string,
    unknown
  >

  return {
    payload: resolved,
    ratings: Array.isArray(resolved.ratings) ? resolved.ratings : [],
  }
}
