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

Agents never own port `3000`. `bun run dev` binds it, but a dev server already
there belongs to the user, so start your own on another port:

```bash
bunx vite dev --port 3100
```

Never stop a process by port number. Stop only the process you started, and
expect the user's server to keep running on `3000` for the whole session.

## Architecture

The current runtime, modules and data flows are documented in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Modules follow a light DDD split under `src/modules/<domain>`:

- `domain/`: pure types and rules. No I/O.
- `application/`: use cases and input schemas.
- `infrastructure/`: adapters (HTTP, D1).
- `client/`: browser-only state, collections and reactive query hooks.
- `presentation/`: domain UI, organized by capability; interaction hooks live
  in `hooks/`, not in `application/`.
- `server/`: TanStack server functions; the only entry point for the UI.
- `queries/`: shared query keys and TanStack Query options.

## Tests

- Keep tests for a domain in one `tests/` directory at the domain root, for
  example `src/modules/build/tests/`. Do not colocate test files beside source
  files or create `__tests__/` directories.
- Inside `tests/`, mirror the source layer and capability so each test's subject
  is easy to find: `domain/`, `application/`, `infrastructure/`,
  `presentation/`, and, where useful, subfolders such as
  `presentation/components/`, `presentation/hooks/` or
  `presentation/helpers/`. Use the same descriptive filename as the unit under
  test with a `.test.ts` or `.test.tsx` suffix.
- Keep tests for shared code outside `src/modules/<domain>` in a `tests/`
  directory owned by that code area (for example `src/hooks/tests/` or
  `src/architecture/tests/`), following the same source-layer/capability
  grouping. Do not create a repository-wide test dump.
- When adding or moving tests, update imports and keep the test next to its
  owning domain and responsibility. Do not leave duplicate tests in the old
  location.

Rules:

- Anything touching `fs`, `child_process`, or the network lives in a
  `.server.ts` file.
- Server functions load their implementation with a dynamic `import()` inside
  the handler so Node-only code never reaches the client bundle.
- Validate server function inputs with zod through `.validator(...)`.
- Domain, application, infrastructure and server modules must not import
  TanStack Router, `src/routes` or `src/routing`. Presentation modules may use
  `Link` and `linkOptions` for their own routes. Routes supply identifiers,
  session identity and navigation callbacks; shared router adapters belong in
  `src/routing`.
- TanStack Start remains in module `server/` adapters. Query and DB integrations
  remain in `queries/` and `client/`.
- Use `build` for the domain, `editor` and `collection` for its UI capabilities.
  Keep plural names for actual collections and preserve persistence keys.
- `src/modules/encore` is the reference server adapter implementation.
- `user.role` is `USER | ADMIN` (default `USER`, not client-settable). Any
  admin-only read/write must check the session role on the server; route guards
  are not authorization.

Current modules:

- `src/modules/catalog`: canonical D1 catalog domain (types, input schemas,
  server functions and shared query options) for characters, weapons and
  echoes. Admin and builder screens both consume it; reads use
  `authMiddleware` and mutations use `adminMiddleware`.
- `src/modules/encore`: read-only game data from the public Encore API
  (characters, weapons and echoes). Used by the admin panel for search and
  create prefill, never as the builder data source.
- `src/modules/build`: local TanStack DB build collection (LocalStorage) and
  the D1 saved-build backend reserved for the future cloud save.
- `src/modules/build/presentation`: build editor, collection and shared UI.
- `src/modules/catalog/presentation/searches`: three independent admin searches
  using Encore, each with its own query, filtering, controls and selection.
- `src/modules/build/presentation/editor/searches`: three independent builder
  searches using the canonical catalog and build selection actions.
- `src/modules/catalog/presentation`: catalog lists, details and forms, including
  Encore-assisted prefill. It must not import infrastructure directly.
- `src/routes` and `src/routing`: route composition and shared navigation adapters.
- `src/db`: Drizzle schema for auth, saved builds and the canonical catalog
  tables (D1).

### Route pages

- Every route renders a page component; the route file only declares the route
  (`loader`, `pendingComponent`, `ssr`), binds params and, for catalog screens,
  wraps the page in `CatalogNavigation` plus its `ActionDock`. Do not put layout
  classes or screen JSX in `src/routes`.
- Pages own their shell through `RouteNavigation` (in
  `src/components/blocks/route-navigation`): `Root`, `Header` (`Title`,
  `Description`, `Actions`) and `Content`.
- Choose the variant by the content: `compact` (default) keeps the `max-w-5xl`
  column for lists, forms and details; `extended` spans the viewport with an
  inset header, for the admin menu and My Builds.
- `RouteNavigation.List` renders the grid and never reads data; the small
  component that suspends owns the query and passes the items down.
- `CatalogSection` and `EditableSection` are section-level APIs, not page chrome.
  `CatalogSection` keeps `Root/Header/Title/Description/Action` for read-only
  sections; today screens only use its `Content`, `Item`, `Image` and `Empty`.

## Category contracts

- `src/modules/game-data/domain/categories.ts` owns category ids, Spanish labels,
  types, validation and derived select options. Reuse it across modules.
- Elements, weapon types and echo classes use stable English string ids.
  Rarity and echo cost remain numeric. Display labels are never persisted as ids.
- Only the Encore infrastructure adapter converts external codes and localized
  names. Catalog writes, saved snapshots and search filters use canonical ids only.
- Category corrections may break old data. Do not add compatibility aliases,
  snapshot migration or version markers for old category representations.
- Weapon `type` and resonator `weaponType` share `WeaponTypeId`; weapon labels
  are derived rather than stored. The canonical spelling is `gauntlets`.

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
  `src/modules/catalog`; Encore is only an admin prefill helper.

## Search dialogs

Integration examples and source-selection guidance live in
[docs/SEARCH_INTEGRATION.md](docs/SEARCH_INTEGRATION.md).

- Keep six independent search components: resonators, weapons and echoes for
  admin, and the same three for builder. Repeated markup is acceptable.
- Only `src/hooks/create-search-filters.ts` abstracts search state. Declare parsers
  outside render, then call the generated hook with an explicit `scope`.
- Filters use nuqs with namespaced URL keys, replace history and shallow updates.
  Closing a dialog clears only its own parameters; echo scopes include the slot.
- Each search owns its query/results hook, pure filtering helper, controls and
  dialog lifecycle. Do not add shared entity-search props, render props or a
  factory that accepts queries, arrays, predicates or UI controls.
- `CommandSearch` supplies UI primitives only. Each search controls `open`, uses
  `closeOnSelect={false}` on items and closes in its own selection handler.
- Source restrictions belong to the query or its results hook. Different source
  scopes require distinct query keys. User filters only narrow the source list.
- Echo selection metadata uses `echoQueries.selection()`; invalidate it after
  editing sonata associations. Do not fetch full details for every result.

## Caching

- `src/providers/query-provider/query.tsx` uses `staleTime: "static"` for
  immutable data.
- Shared query options live in `src/modules/encore/queries` (external API) and
  `src/modules/catalog/queries` (canonical D1 catalog). Screens must use them
  instead of defining their own.
- Encore queries use a 6-hour `staleTime`; freshness is TTL-based, not tied to a
  deploy. Catalog queries use a 5-minute `staleTime` because admins edit D1.
- Saved builds are scoped by user/build identity and payload `documentVersion`,
  never by catalog freshness.
- TanStack DB builds are filtered by `userId` (the Better Auth user) in every
  live query. The LocalStorage collection itself is shared by origin, so never
  list or mutate a build without checking the user. Never scope builds by the
  session id: it changes on every sign-in and would orphan them.
- The builder UI contract and pending screens are documented in
  [docs/BUILDER_UI.md](docs/BUILDER_UI.md).
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

### Data loading and Suspense

- **Suspend in the smallest component.** A `useSuspenseQuery` (or any
  suspending read) belongs to the component that renders only the suspended
  region. Put the `Suspense` boundary around that component, never around a
  page, a header or a section that also draws chrome.
  ```tsx
  <section className="space-y-6">
    <header>
      <h1>Resonadores</h1>
    </header>
    <Suspense fallback={<ListSkeleton />}>
      <ResonatorList />
    </Suspense>
  </section>
  ```
  `ResonatorList` is the only component that suspends: it loads the items and
  renders the list. The title, description and actions render before the data
  arrives, so the pending state never blanks the page.
- **Page chrome never suspends.** A section header whose text comes from the
  same read (`Eco: {name}`) may share its section's boundary, but the page
  header, actions and the screen shell always render with the route.
- **Lists receive their items as props.** The page never fetches just to feed a
  grid; the small component that suspends owns the query, the empty state and
  the list. Loading skeletons belong to the `fallback`, not to the page.

### Imports, icons and stat keys

- **Use the domain aliases.** Import internal modules through `@/*` or a domain
  alias: `@build/*`, `@catalog/*`, `@encore/*` and
  `@db/*`. Do not add relative imports that climb directories (`../`).
- **Let icons inherit their size.** Do not pass a hardcoded `size` to an icon;
  size it from the parent container with CSS.
- **Use canonical stat keys.** Stats use the `BuildStatKey` ids from
  `src/modules/build/domain/stats.ts` everywhere: catalog rows, calculation,
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
  whole-document adapter (`src/modules/catalog/infrastructure/catalog-d1.server.ts`).
  The builder reads it through `src/modules/catalog`; rows still come from the
  admin panel, since there is no scheduled Encore sync yet.
- The saved-builds backend and local build collection exist
  (`src/db/schemas/builds.ts`, `src/modules/build`). Builds can start without a
  resonator; `/panel/builder/$buildId` loads one by ID and `/panel/my-builds`
  groups local builds by resonator. Cloud saves and cloud build listing are
  still pending. See [docs/BUILDER_UI.md](docs/BUILDER_UI.md).
- Catalog weapon and echo queries are exposed; the builder editor that consumes
  them is still pending.
