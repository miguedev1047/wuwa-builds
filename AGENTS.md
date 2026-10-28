# AGENTS.md

Instructions for agents (and humans) working on this repository. Keep this file
in sync when conventions change.

## Project

Wuthering Waves build generator. Content-first React app

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

## Architecture

ModD split ules follow a light DDunder `src/modules/<domain>`:

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

## Data pipeline (wuwa)

- JSON lives in `src/data/wuwa-resonators|other-folder` and is committed to git.
- Scraping is manual (~monthly) and development-only. It uses `curl` because
  Cloudflare blocks Node's `fetch` (TLS fingerprint).
- The scraper skips files whose content did not change (it ignores
  `fetchedAt`), so monthly commits only contain real changes.
- Runtime reads are bundled at build time with `import.meta.glob`, because
  workerd has no `node:fs`. Re-scraping requires a rebuild/redeploy.
- `WUWA_RESONATORS_DIR` and `--out` only change where the scraper writes.

Refresh flow:

```bash
bun run scrape --force
git add src/data && git commit -m "chore(wuwa): refresh resonator data"
bun run typecheck && bun run build
```

## Caching

- `src/lib/query.tsx` uses `staleTime: "static"`: data is immutable until the
  next deploy.
- Query keys must include `WUWA_DATA_VERSION` (see
  `src/modules/wuwa/queries/keys.ts`), a build-time hash of `index.json`.
  When data changes, keys change and every cache is invalidated.
- If a query ever needs freshness (for example the builder), override
  `staleTime` in that query's options instead of changing the global default.
- Any future persistence (TanStack DB, SQLite, IndexedDB) must be namespaced
  by `WUWA_DATA_VERSION`.

## Cloudflare Workers

- SSR runs in workerd: no `node:fs` and no `node:child_process`. Do not import
  Node built-ins in code reachable from the runtime path.
- The data chunk is ~0.9 MiB gzip; the whole upload is ~1.1 MiB compressed.
  Check before deploying with `bunx wrangler deploy --dry-run`.
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
- Weapons and echoes catalogs are not scraped yet; they are one request each
  (the full catalog ships in the list page payload).
