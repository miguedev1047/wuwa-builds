# AGENTS.md

Instructions for agents (and humans) working on this repository. Keep this file
in sync when conventions change.

## Project

Wuthering Waves build generator. Content-first React app with scraped Prydwen
data stored as JSON and served through TanStack Start server functions.

## Stack

- **Bun** for package management and scripts.
- **TanStack Start** (file router in `src/routes`, server functions).
- **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**.
- **TanStack Query** for the client cache.
- **zod** for input validation.
- **Cloudflare Workers** through `@cloudflare/vite-plugin` + Wrangler.

## Commands

| Command                    | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `bun run dev`              | Dev server (SSR runs in workerd)          |
| `bun run build`            | Production build                          |
| `bun run preview`          | Preview the built Worker locally          |
| `bun run typecheck`        | `tsc --noEmit`; must stay clean           |
| `bun run lint`             | ESLint                                    |
| `bun run format` / `check` | Prettier write/check                      |
| `bun run scrape`           | Refresh resonator JSON (development only) |
| `bun run scrape:catalogs`  | Refresh weapon/echo catalogs (dev only)   |

## Architecture

Modules follow a light DDD split under `src/modules/<domain>`:

- `domain/`: pure types and rules. No I/O.
- `application/`: use cases and input schemas.
- `infrastructure/`: adapters (HTTP, files, bundling).
- `server/`: TanStack server functions; the only entry point for the UI.
- `cli/`: developer scripts.

Rules:

- Anything touching `fs`, `child_process`, or the network lives in a
  `.server.ts` file.
- Server functions load their implementation with a dynamic `import()` inside
  the handler so Node-only code never reaches the client bundle.
- Validate server function inputs with zod through `.validator(...)`.
- `src/modules/wuwa` is the reference implementation; follow its patterns.

Current modules:

- `src/modules/encore`: read-only game data from the public Encore API
  (characters, weapons and echoes). Used by the admin and builder screens.
- `src/modules/wuwa`: Prydwen editorial data and scraper. Kept for build
  recommendations and tier data; no longer the source of raw game stats.
- `src/modules/builds`: saved user builds (D1/Drizzle).
- `src/modules/panel`: panel UI behavior only. It must not import
  infrastructure directly.

## Data pipeline (wuwa)

- JSON lives in `src/data/wuwa-resonators` (characters) and
  `src/data/wuwa-catalogs` (weapons, echoes, echo sets), and is committed to
  git.
- Scraping is manual (~monthly) and development-only. It uses `curl` because
  Cloudflare blocks Node's `fetch` (TLS fingerprint).
- The scraper skips files whose content did not change (it ignores
  `fetchedAt`), so monthly commits only contain real changes.
- Runtime reads are bundled at build time with `import.meta.glob`, because
  workerd has no `node:fs`. Re-scraping requires a rebuild/redeploy.
- `WUWA_RESONATORS_DIR`, `WUWA_CATALOGS_DIR`, and `--out` only change where the
  scraper writes.

Refresh flow:

```bash
bun run scrape --force
bun run scrape:catalogs
git add src/data && git commit -m "chore(wuwa): refresh game data"
bun run typecheck && bun run build
```

### Encore game data

Raw game data (characters, weapons, echoes) is read from
`https://api-v2.encore.moe/api/{lang}/...` through `src/modules/encore`:

- Server cache: 5-minute in-memory dedupe + 6-hour Cloudflare edge cache.
- Client cache: shared query options use `staleTime: 6h`, `gcTime: 24h`.
- Lore-only fields (`Words`, `Stories`, `Model3D`, `SkillInputs`, ...) are
  dropped by the mapper.
- Do **not** use `WUWA_DATA_VERSION` for Encore data; it changes with game
  patches, not deploys.

## Caching

- `src/providers/query-provider/query.tsx` uses `staleTime: "static"`:
  immutable deployed data.
- Prydwen JSON query keys include `WUWA_DATA_VERSION` (see
  `src/modules/wuwa/queries/keys.ts`), a build-time hash of all scraped JSON
  (resonator details + catalogs). When data changes, keys change and every
  catalog cache is invalidated.
- Shared query options live in `src/modules/wuwa/queries` and
  `src/modules/encore/queries`. Screens must use them instead of defining their
  own.
- Encore queries are a separate namespace with `staleTime: 6h`. Do not add
  `WUWA_DATA_VERSION` to them.
- `WUWA_DATA_VERSION` namespaces only immutable catalog caches. Saved builds are
  scoped by user/build identity and payload `documentVersion`, never by the
  catalog version.
- If a query ever needs freshness (for example the builder), override
  `staleTime` in that query's options instead of changing the global default.
- Any future persistence (TanStack DB, SQLite, IndexedDB) must namespace
  catalog caches by `WUWA_DATA_VERSION` and saved builds by user/build identity.

## Cloudflare Workers

- SSR runs in workerd: no `node:fs` and no `node:child_process`. Do not import
  Node built-ins in code reachable from the runtime path.
- The data chunk is ~0.9 MiB gzip; the whole upload is ~1.1 MiB compressed
  (+~33 KB gzip when the catalog server functions are used). Check before
  deploying with `bunx wrangler deploy --dry-run`.
- `wrangler.jsonc` uses `main: "@tanstack/react-start/server-entry"` and
  `compatibility_flags: ["nodejs_compat"]`.
- The scraper never runs in the Worker, not even in dev.

## Conventions

- **English** for code comments, documentation, and commit messages.
- Prettier style: no semicolons, double quotes, 2 spaces, 80 columns.
- Prefer honest types; passthrough JSON may use `unknown` with a comment.
- Conventional commits: `feat(wuwa): ...`, `fix(panel): ...`,
  `chore(wuwa): ...`.
- Commit only the files related to the requested change. Leave unrelated
  working-tree changes untouched.
- Run `bun run typecheck` before finishing. Run `bun run build` (and
  `wrangler deploy --dry-run` when relevant) for build-affecting changes.

## Known limitations

- Scraping cannot run inside the Worker; use the CLI.
- Some resonators have `stats: null` because Prydwen has no stats table for
  them yet.
- Data freshness depends on the manual monthly scrape; the UI does not refetch.
- Prydwen's catalogs (weapons/echoes) remain available for editorial use, but
  no screen imports them; Encore is the active game-data source.
- The saved-builds backend exists (`src/db/schemas/builds.ts`,
  `src/modules/builds`) but no TanStack DB collection or builder UI is wired
  yet.
