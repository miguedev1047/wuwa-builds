# Domain: Wuthering Waves

Resonator data (Prydwen builds) and its scraper. Light DDD split: pure domain,
use cases, infrastructure, and an entry layer (server functions + CLI).

## Structure

```
src/modules/wuwa/
├── domain/
│   ├── resonator.ts                  # pure types (Resonator, ResonatorIndex, ...)
│   └── catalog.ts                    # shared catalogs (weapons, echoes, sets)
├── application/
│   ├── schemas.ts                    # input contracts (zod)
│   ├── read-resonators.server.ts     # resonator read use cases
│   ├── read-catalogs.server.ts       # weapon/echo read use cases
│   ├── scrape-resonators.server.ts   # resonator scraping use case
│   └── scrape-catalogs.server.ts     # catalog scraping use case
├── infrastructure/
│   ├── prydwen/
│   │   ├── http.server.ts            # transport (curl + retries)
│   │   ├── flight.server.ts          # RSC payload parser
│   │   ├── characters-page.server.ts # character index (HTML)
│   │   ├── catalogs-page.server.ts   # weapon/echo catalogs (payload arrays)
│   │   └── mapper.server.ts          # Prydwen payload -> domain model
│   ├── resonators-file-store.server.ts # JSON persistence (scraper, Node only)
│   ├── resonators-bundle.server.ts     # resonator JSON bundled at build
│   ├── catalog-file-store.server.ts    # catalog JSON persistence
│   └── catalogs-bundle.server.ts       # catalog JSON bundled at build
├── server/
│   ├── resonators.ts                 # resonator server functions
│   └── catalogs.ts                   # weapon/echo server functions
└── cli/
    ├── scrape.ts                     # resonator CLI
    └── scrape-catalogs.ts            # weapons/echoes CLI
```

Everything that touches the filesystem or the network uses the `.server.ts`
suffix, so TanStack Start import protection keeps it out of the client bundle.

## Data

Written to `src/data` and **committed to git** (refreshed manually, about once
a month).

### Resonators — `src/data/wuwa-resonators`

- `<slug>.json` per character (profile, builds, stats, synergies, ...).
- `index.json` with the roster and its tier ratings.

### Shared catalogs — `src/data/wuwa-catalogs`

Prydwen ships each catalog as one array inside its list page, so this is two
requests total and no detail pages:

| File             | Contents                                            |
| ---------------- | --------------------------------------------------- |
| `weapons.json`   | 124 weapons with rarity, type, stats and effect     |
| `echoes.json`    | 187 echoes with sonata groups and skill multipliers |
| `echo-sets.json` | 37 echo sets with 2/3/5-piece bonuses               |

Each file is `{ source, fetchedAt, count, items }`. Echoes and echo sets come
from the same request (`/wuthering-waves/echoes`).

To keep diffs clean, both scrapers compare the new JSON with the stored one
ignoring `fetchedAt` and **do not rewrite the file when nothing changed**: the
monthly commit only shows what Prydwen actually touched.

`WUWA_RESONATORS_DIR`, `WUWA_CATALOGS_DIR` and `--out` only change where the
scraper writes. At runtime nothing is read from disk: resonators and catalogs
are bundled into the server build with `import.meta.glob` (see
`infrastructure/resonators-bundle.server.ts` and
`infrastructure/catalogs-bundle.server.ts`), which is required on Cloudflare
Workers (workerd has no `node:fs`) and also works on Node. Consequence: after
re-scraping, rebuild/redeploy so the runtime sees the new data.

### Cloudflare Workers

- SSR runs in workerd: no `node:fs` or `node:child_process`. The scraper stays
  local (`bun run scrape`) and never runs in the Worker.
- The JSON ships inside the server bundle: ~3.5 MB raw, **~0.9 MB gzip**. The
  total Wrangler upload is ~1.1 MiB compressed, under the 3 MiB free-plan limit
  (10 MiB paid).
- Index and per-character reads live in `.server.ts` modules, so they never
  reach the client bundle.
- Catalogs add ~33 KB gzip when the catalog server functions are used.

## Refreshing the data

```bash
bun run scrape                  # resonators: incremental, only fetch what is missing

bun run scrape --force          # resonators: re-fetch everything
bun run scrape --only aalto,carlotta
bun run scrape --limit 5 --concurrency 2 --delay 800

bun run scrape:catalogs         # weapons + echoes + echo sets (2 requests)
bun run scrape:catalogs --force # rewrite catalogs even if unchanged

bun run scrape --out src/data/other-folder
bun run scrape:catalogs --out src/data/other-folder
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
the scraped JSON (resonator index + catalogs) injected at build time from
`vite.config.ts`:

```ts
const indexKey = ["wuwa", WUWA_DATA_VERSION, "resonators"]
const detailKey = ["wuwa", WUWA_DATA_VERSION, "resonators", slug]
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

### Catalogs

```tsx
import {
  getWeapons,
  getWeapon,
  getEchoes,
  getEcho,
  getEchoSets,
  getEchoSet,
} from "@/modules/wuwa/server/catalogs"

const weapons = await getWeapons() // { source, fetchedAt, count, items }
const weaponBySlug = await getWeapon({ data: { slug: "abyss-surges" } })
const weaponById = await getWeapon({ data: { id: "21040015" } })

const echoes = await getEchoes()
const echoBySlug = await getEcho({ data: { slug: "abyssal-gladius" } })
const echoById = await getEcho({ data: { id: "320000260" } })

const echoSet = await getEchoSet({ data: { sonataId: 5 } })
const echoSetBySlug = await getEchoSet({ data: { slug: "celestial-light" } })
```

Weapons and echoes accept `{ id }` or `{ slug }`; echo sets accept
`{ sonataId }` or `{ slug }`. When both are sent, the numeric/ID value wins.

Inputs are validated with zod (`application/schemas.ts`) through
`.validator(...)`, which accepts any Standard Schema.
