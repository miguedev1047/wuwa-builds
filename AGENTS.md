# AGENTS.md

Instructions for agents (and humans) working on this repository. Keep this file
in sync when conventions change.

## Project

Wuthering Waves build generator. Content-first React app with game data from the
public Encore API and saved user builds in D1.

## Stack

- **Bun** for package management and scripts.
- **TanStack Start** (file router in `src/routes`, server functions).
- **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**.
- **TanStack Query** for the client cache.
- **zod** for input validation.
- **Drizzle ORM + D1** for saved builds and auth tables.
- **Cloudflare Workers** through `@cloudflare/vite-plugin` + Wrangler.

## Commands

| Command                    | Purpose                          |
| -------------------------- | -------------------------------- |
| `bun run dev`              | Dev server (SSR runs in workerd) |
| `bun run build`            | Production build                 |
| `bun run preview`          | Preview the built Worker locally |
| `bun run typecheck`        | `tsc --noEmit`; must stay clean  |
| `bun run lint`             | ESLint                           |
| `bun run format` / `check` | Prettier write/check             |

## Architecture

Modules follow a light DDD split under `src/modules/<domain>`:

- `domain/`: pure types and rules. No I/O.
- `application/`: use cases and input schemas.
- `infrastructure/`: adapters (HTTP, D1).
- `server/`: TanStack server functions; the only entry point for the UI.
- `queries/`: shared query keys and TanStack Query options.

Rules:

- Anything touching `fs`, `child_process`, or the network lives in a
  `.server.ts` file.
- Server functions load their implementation with a dynamic `import()` inside
  the handler so Node-only code never reaches the client bundle.
- Validate server function inputs with zod through `.validator(...)`.
- `src/modules/encore` is the reference implementation; follow its patterns.
- `user.role` is `USER | ADMIN` (default `USER`, not client-settable). Any
  admin-only read/write must check the session role on the server; route guards
  are not authorization.

Current modules:

- `src/modules/encore`: read-only game data from the public Encore API
  (characters, weapons and echoes). Used by the admin and builder screens.
- `src/modules/builds`: saved user builds (domain payload, ports, D1 adapter,
  authenticated server functions).
- `src/modules/panel`: panel UI behavior only. It must not import
  infrastructure directly.
- `src/db`: Drizzle schema for auth and builds (D1).

## Game data

Raw game data is read from `https://api-v2.encore.moe/api/{lang}/...` through
`src/modules/encore` (`es` by default, `en` available):

- `character?page=1`, `character/{id}`
- `weapon`, `weapon/{id}`
- `echo`, `echo/{id}`

Rules:

- Server cache: 5-minute in-memory dedupe + 6-hour Cloudflare edge cache.
- Client cache: shared query options use `staleTime: 6h`, `gcTime: 24h`.
- Lore-only fields (`Words`, `Stories`, `Model3D`, `SkillInputs`, ...) are
  dropped by the mapper.
- There is no local game-data snapshot or scraper. Do not reintroduce committed
  character JSON without a concrete reason.

## Caching

- `src/providers/query-provider/query.tsx` uses `staleTime: "static"` for
  immutable data.
- Shared query options live in `src/modules/encore/queries`. Screens must use
  them instead of defining their own.
- Encore queries use a 6-hour `staleTime`; freshness is TTL-based, not tied to a
  deploy.
- Saved builds are scoped by user/build identity and payload `documentVersion`,
  never by catalog freshness.
- If a query needs a different freshness (for example the builder), override
  `staleTime` in that query's options instead of changing the global default.
- Any future persistence (TanStack DB, SQLite, IndexedDB) must namespace saved
  builds by user/build identity and catalog caches by the catalog source.

## Cloudflare Workers

- SSR runs in workerd: no `node:fs` and no `node:child_process`. Do not import
  Node built-ins in code reachable from the runtime path.
- No game-data JSON is bundled; Encore responses are cached at the edge for 6h.
- Check the upload with `bunx wrangler deploy --dry-run` when relevant.
- `wrangler.jsonc` uses `main: "@tanstack/react-start/server-entry"` and
  `compatibility_flags: ["nodejs_compat"]`.

## Conventions

- **English** for code comments, documentation, and commit messages.
- Prettier style: no semicolons, double quotes, 2 spaces, 80 columns.
- Prefer honest types; passthrough JSON may use `unknown` with a comment.
- Conventional commits: `feat(encore): ...`, `fix(panel): ...`,
  `chore(builds): ...`.
- Commit only the files related to the requested change. Leave unrelated
  working-tree changes untouched.
- Run `bun run typecheck` before finishing. Run `bun run build` (and
  `wrangler deploy --dry-run` when relevant) for build-affecting changes.

## Known limitations

- Encore is a third-party public API. The 6-hour cache means a game patch can
  take up to 6h to appear.
- The saved-builds backend exists (`src/db/schemas/builds.ts`,
  `src/modules/builds`) but no TanStack DB collection or builder UI is wired
  yet.
- Weapon and echo queries are exposed but no screen uses them yet.
