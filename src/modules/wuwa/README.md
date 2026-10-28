# Domain: Wuthering Waves

Resonator data (Prydwen builds) and its scraper. Light DDD split: pure domain,
use cases, infrastructure, and an entry layer (server functions + CLI).

## Structure

```
src/modules/wuwa/
├── domain/
│   └── resonator.ts                  # pure types (Resonator, ResonatorIndex, ...)
├── application/
│   ├── schemas.ts                    # input contracts (zod)
│   ├── read-resonators.server.ts     # read use cases
│   └── scrape-resonators.server.ts   # scraping use case
├── infrastructure/
│   ├── prydwen/
│   │   ├── http.server.ts            # transport (curl + retries)
│   │   ├── flight.server.ts          # RSC payload parser
│   │   ├── characters-page.server.ts # character index (HTML)
│   │   └── mapper.server.ts          # Prydwen payload -> domain model
│   ├── resonators-file-store.server.ts # JSON persistence (scraper, Node only)
│   └── resonators-bundle.server.ts     # JSON bundled at build (runtime)
├── server/
│   └── resonators.ts                 # server functions (TanStack Start)
└── cli/
    └── scrape.ts                     # development CLI
```

Everything that touches the filesystem or the network uses the `.server.ts`
suffix, so TanStack Start import protection keeps it out of the client bundle.

## Data

Written to `src/data/wuwa-resonators` and **committed to git** (refreshed
manually, about once a month):

- `<slug>.json` per character (profile, builds, stats, synergies, ...).
- `index.json` with the roster and its tier ratings.

To keep diffs clean, the scraper compares the new JSON with the stored one
ignoring `fetchedAt` and **does not rewrite the file when nothing changed**: the
monthly commit only shows the characters Prydwen actually touched.

`WUWA_RESONATORS_DIR` and `--out` only change where the scraper writes. At
runtime nothing is read from disk: the JSON is bundled into the server build
with `import.meta.glob` (see `infrastructure/resonators-bundle.server.ts`). That
is required on Cloudflare Workers, where workerd has no `node:fs`, and it also
works on Node. Consequence: after re-scraping, rebuild/redeploy so the runtime
sees the new data.

### Cloudflare Workers

- SSR runs in workerd: no `node:fs` or `node:child_process`. The scraper stays
  local (`bun run scrape`) and never runs in the Worker.
- The JSON ships inside the server bundle: ~3.5 MB raw, **~0.9 MB gzip**. The
  total Wrangler upload is ~1.1 MiB compressed, under the 3 MiB free-plan limit
  (10 MiB paid).
- Index and per-character reads live in `.server.ts` modules, so they never
  reach the client bundle.

## Refreshing the data

```bash
bun run scrape                  # incremental: only fetch what is missing
bun run scrape --force          # re-fetch everything
bun run scrape --only aalto,carlotta
bun run scrape --limit 5 --concurrency 2 --delay 800
bun run scrape --out src/data/other-folder
```

Development only: the CLI aborts with `NODE_ENV=production` and the
`scrapeResonators` server function checks `import.meta.env.DEV`. It cannot run
inside the Worker either (no curl and no filesystem), so use the CLI.

### Why `curl`

Prydwen sits behind Cloudflare: Node/Bun `fetch` gets a 403
(`Just a moment...`) because of the TLS fingerprint. `curl` with a browser
`User-Agent` returns the HTML, and it adds no dependencies.

### Where the data comes from

The site is Next.js (App Router) and has no public API. Every page renders the
props object used by its client components on the server and ships it inside the
RSC payload (`self.__next_f.push(...)`). The parser extracts that object instead
of reading the DOM, so the values are exactly what the page shows. Long texts
(`review`, `rotations`) arrive as separate `T` rows and are resolved with
`createTextLookup`.

## Cache

`src/lib/query.tsx` uses `staleTime: "static"`: data only changes when it is
re-scraped and deployed, so there is no refetch on mount/focus/reconnect.

Query keys (`queries/keys.ts`) are prefixed with `WUWA_DATA_VERSION`, a hash of
`index.json` injected at build time from `vite.config.ts`:

```ts
;["wuwa", WUWA_DATA_VERSION, "resonators"][
  ("wuwa", WUWA_DATA_VERSION, "resonators", slug)
]
```

When new data is deployed every key changes, so any cache (memory, and a future
TanStack DB/SQLite persistence) is invalidated with no extra logic. After
re-scraping locally, restart the dev server to recompute the hash.

## Usage from the app

```tsx
import { getResonators, getResonator } from "@/modules/wuwa/server/resonators"

// In a loader or component
const index = await getResonators()
const aalto = await getResonator({ data: { slug: "aalto" } })
```

Inputs are validated with zod (`application/schemas.ts`) through
`.validator(...)`, which accepts any Standard Schema.
