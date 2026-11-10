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
| `bun test`                 | Unit tests (Bun)                 |
| `bun run lint`             | ESLint                           |
| `bun run format` / `check` | Prettier write/check             |

## Architecture

Modules follow a light DDD split under `src/modules/<domain>`:

- `domain/`: pure types and rules. No I/O.
- `application/`: use cases and input schemas.
- `infrastructure/`: adapters (HTTP, D1).
- `client/`: browser-only state and collections.
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

- `src/modules/game-data`: canonical D1 catalog domain (types, input schemas,
  server functions and shared query options) for characters, weapons and
  echoes. Admin and builder screens both consume it; reads use
  `authMiddleware` and mutations use `adminMiddleware`.
- `src/modules/encore`: read-only game data from the public Encore API
  (characters, weapons and echoes). Used by the admin panel for search and
  create prefill, never as the builder data source.
- `src/modules/builds`: local TanStack DB build collection (LocalStorage) and
  the D1 saved-build backend reserved for the future cloud save.
- `src/modules/panel`: panel UI behavior only. It must not import
  infrastructure directly. Admin views stay in
  `src/modules/panel/admin/game-data/views`.
- `src/db`: Drizzle schema for auth, saved builds and the canonical catalog
  tables (D1).

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
- Builder screens read the canonical catalog from D1 through
  `src/modules/game-data`; Encore is only an admin prefill helper.

## Caching

- `src/providers/query-provider/query.tsx` uses `staleTime: "static"` for
  immutable data.
- Shared query options live in `src/modules/encore/queries` (external API) and
  `src/modules/game-data/queries` (canonical D1 catalog). Screens must use them
  instead of defining their own.
- Encore queries use a 6-hour `staleTime`; freshness is TTL-based, not tied to a
  deploy. Catalog queries use a 5-minute `staleTime` because admins edit D1.
- Saved builds are scoped by user/build identity and payload `documentVersion`,
  never by catalog freshness.
- TanStack DB builds are filtered by `sessionId` in every live query. The
  LocalStorage collection itself is shared by origin, so never list or mutate a
  build without checking the session.
- The builder UI contract and pending screens are documented in
  `BUILDER_UI.md`.
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
- Keep every component under 200 lines. When a section grows, split it into
  its `index.tsx` root plus one file per component under `components/`, and
  name each file after the entity and its role
  (`property-growth-add-form.tsx`), never with generic names
  (`add-level-action.tsx`).
- Keep component bodies comment-free. Document props on their type and exported
  functions/components with a JSDoc block above them; no `//` or `{/* ... */}`
  inside a render tree, callback or hook body.
- Prettier style: no semicolons, double quotes, 2 spaces, 80 columns.
- Prefer honest types; passthrough JSON may use `unknown` with a comment.
- Conventional commits: `feat(encore): ...`, `fix(panel): ...`,
  `chore(builds): ...`.
- Commit only the files related to the requested change. Leave unrelated
  working-tree changes untouched.
- Run `bun run typecheck` before finishing. Run `bun run build` (and
  `wrangler deploy --dry-run` when relevant) for build-affecting changes.

### Styling and conditional rendering

- **Use `cn` for class names.** Pass conditional, dynamic and concatenated
  `className` values through `cn` from `"cn"`. Do not build class strings with
  template literals or manual concatenation.
  ```tsx
  <div className={cn("flex items-center gap-2", isActive && "bg-muted")} />
  ```
- **Render conditions with `Show`.** Do not use ternaries to choose JSX. Put
  the alternative in `fallback` and use a render-prop child when the content
  depends on a nullable value.
  ```tsx
  <Show when={user} fallback={<EmptyUser />}>
    {(selected) => <UserProfile user={selected} />}
  </Show>
  ```

### Imports, icons and stat keys

- **Use the domain aliases.** Import internal modules through `@/*` or a domain
  alias: `@builder/*`, `@panel/*`, `@builds/*`, `@game-data/*`, `@encore/*` and
  `@db/*`. Do not add relative imports that climb directories (`../`).
- **Let icons inherit their size.** Do not pass a hardcoded `size` to an icon;
  size it from the parent container with CSS.
- **Use canonical stat keys.** Stats use the `BuildStatKey` ids from
  `src/modules/builds/domain/stats.ts` everywhere: catalog rows, calculation,
  icons and UI. Do not introduce aliases such as `critRate` or `skill_dmg`.

### Runtime

- **Use Bun only.** Manage packages and run scripts with `bun` / `bunx`; npm,
  pnpm and yarn are not allowed.
- **Prefetch with `query`.** Use `queryClient.query(...)` to prefetch or
  resolve cached data; `.ensureQuery(...)` is deprecated.

## Known limitations

- Encore is a third-party public API. The 6-hour cache means a game patch can
  take up to 6h to appear.
- The canonical catalog lives in normalized D1 tables
  (`src/db/schemas/resonators.ts`, `weapons.ts`, `echoes.ts`) with a
  whole-document adapter (`src/modules/encore/infrastructure/catalog-d1.server.ts`).
  The builder reads it through `src/modules/game-data`; rows still come from the
  admin panel, since there is no scheduled Encore sync yet.
- The saved-builds backend and local build collection exist
  (`src/db/schemas/builds.ts`, `src/modules/builds`). Builds can start without a
  resonator; `/panel/builder/$buildId` loads one by ID and `/panel/my-builds`
  groups local builds by resonator. Cloud saves and cloud build listing are
  still pending. See `BUILDER_UI.md`.
- Catalog weapon and echo queries are exposed; the builder editor that consumes
  them is still pending.
