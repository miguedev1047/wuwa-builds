# Builder Data Model and Connection Plan

## Scope

Connect the existing resonator selector to a local editable build draft, define
one serializable build document for local and cloud persistence, and calculate
derived stats client-side. This plan covers data flow and frontend integration
contracts only. It does not prescribe page layout, visual design, or styling.

## Current State

- Saved builds already have a D1/Drizzle table and authenticated server
  functions under `src/modules/builds`.
- `BuildPayload` in `src/modules/builds/domain/build.ts` currently contains IDs
  and a few simple arrays, but not the older builder's levels, skills, weapon
  rank, or per-echo configuration.
- `BuildDraft`, `createEmptyBuildDraft`, the D1/editor converters, and a
  Local Storage collection factory exist as initial scaffolding.
- `src/routes/(panel)/panel/new-build.tsx` loads the shared resonator index.
- `ResonatorItem` still fetches the full resonator profile and logs it when
  clicked. It should instead select by slug and create a local draft.
- `src/routes/(panel)/panel/builder.tsx` is still a placeholder.
- The old Zustand example is a requirements reference, not code to port
  literally. It mixes UI state, remote reads, derived stats, and persistence.

## Architecture Decisions

- The editor operates on a UI-independent `BuildDraft`, never directly on an
  Encore game-data object or a Drizzle row.
- Define one versioned `BuildPayload` document. The Local Storage draft and D1
  row both contain this payload; their metadata wrappers can differ.
- A build stores stable catalog references and user choices, not copied catalog
  records. `resonatorSlug` remains row/draft metadata; weapons and echoes are
  referenced by IDs or slugs.
- Catalog records are resolved from the shared `encore/queries` data at runtime.
  Catalog refreshes may change displayed metadata without rewriting builds.
- Calculate stats in a pure client-side function using the build payload and
  resolved catalog data. Do not persist `totalStats` as authoritative state.
- Local Storage is the durable local draft adapter. D1 remains the cloud source
  of truth for saved builds; Local Storage alone does not sync across devices.
- Keep `documentVersion` and the Local Storage schema/key version independent:
  they version the build payload shape and the local draft representation.

## Initial Build Payload V1

Expand `buildPayloadSchema` based on the useful concepts in the old builder, but
use explicit, serializable identifiers and fixed semantics:

```ts
type BuildPayloadV1 = {
  resonator: {
    level: number
    sequenceRank: number
    skillLevels: Record<SkillId, number>
  }
  weapon: {
    weaponId: string | null
    level: number
    refinementRank: number
  }
  echoLoadout: [EchoSlot, EchoSlot, EchoSlot, EchoSlot, EchoSlot]
  mainEchoSlot: 0 | 1 | 2 | 3 | 4 | null
  notes: string
}

type EchoSlot = {
  echoId: string | null
  level: number
  mainStatId: string | null
  substats: Array<{ statId: string; value: number }>
  // Include sonataId only if the user selects a set per equipped echo.
}
```

Before locking V1, verify the game's valid ranges and decide:

1. Whether sequences are represented by one `sequenceRank` or independently
   toggled sequence nodes. Do not preserve the old ten-boolean placeholder
   without confirming its meaning.
2. Whether a selected echo's Sonata set is derived from the catalog or must be
   stored as a per-slot `sonataId` choice.
3. Whether substat values store exact values or roll counts. Define one numeric
   convention for percent values and use it consistently.
4. The exact skill identifiers and whether all five skill levels are always
   editable.

Do not duplicate `mainEchoId` when it can be represented by `mainEchoSlot` into
the five-slot loadout. Do not persist display names, icons, descriptions, or
calculated totals. If the document changes after the first saved build, add an
explicit migration from the previous `documentVersion` before bumping it.

## Data Contracts and Conversions

### Local editor model

Keep `BuildDraft` as the row edited by the builder and stored in the local
collection. It should contain:

- local `id` (collection key);
- nullable `savedBuildId` (null until saved to D1);
- `resonatorSlug`, editable name, `documentVersion`, and `BuildPayload`;
- JSON-safe ISO timestamps.

The empty-draft factory must create fresh nested arrays/objects for every draft.
Do not use shared mutable `DEFAULT_*` objects or shallow-copy nested echo
substats between slots.

### Cloud model

Keep D1's `BuildRecord` metadata (`id`, `userId`, `resonatorSlug`, name,
timestamps, `documentVersion`) separate from the portable payload. The server
continues to derive `userId` from Better Auth; never accept it from the client.

Keep and evolve the explicit converters in
`src/modules/builds/application/mappers/build-draft.ts`:

- `BuildRecord -> BuildDraft` when opening a saved build;
- `BuildDraft -> CreateBuildInput` for a new cloud build;
- `BuildDraft -> UpdateBuildInput` for an existing cloud build.

Converters strip local-only fields and verify supported document versions.
Keep Drizzle/Zod row schemas, public mutation schemas, and the domain payload
schema distinct. Local drafts can be incomplete; save inputs enforce the
requirements for a cloud record.

## Client-Side Calculation Boundary

Create a pure calculation module, for example
`src/modules/builds/domain/calculate-build-stats.ts`:

```ts
calculateBuildStats(payload, referenceData) => calculatedStats
```

- It receives all required resonator, weapon, echo, and set data as arguments.
- It performs no React hooks, TanStack Query calls, network requests, D1 reads,
  or Local Storage access.
- It returns derived values; the caller can recompute them from the draft and
  current catalog data whenever either changes.
- Load catalog/reference data through the existing shared query options before
  calling it. Missing or removed catalog references should yield an explicit
  unavailable state, not delete the saved build.
- Keep game formulas and lookup tables independent of components. Add focused
  tests for formulas and boundary cases before treating totals as authoritative.

Remove the old Zustand/TRPC responsibilities rather than porting them:

- no hooks inside store/calculation functions;
- no remote `loadBuild` hidden inside state actions;
- no `totalStats` persisted with the build;
- no duplicated, mutable default object graph shared between drafts.

## Builder Connection Sequence

1. **Finalize the payload contract.** Expand the Zod payload schema and its
   inferred type. Update the Drizzle JSON type and DB validators to use it.
   Decide the four V1 questions above before generating/applying a migration.
2. **Complete local draft persistence.** Keep
   `createBuildDraftCollection(scopeId, storage)` client-only, scoped by the
   authenticated user (or an explicit guest scope), and validate restored rows
   with `buildDraftSchema`. Create/use the collection once per scope; clean it
   up or switch scopes when auth changes.
3. **Connect resonator selection.** `ResonatorItem` emits only `resonatorSlug`.
   Remove the full-profile fetch and console logging from its click handler.
   The selection flow calls `createEmptyBuildDraft`, inserts the draft into the
   local collection, and navigates using its local draft ID.
4. **Connect the builder route.** Replace the placeholder
   `src/routes/(panel)/panel/builder.tsx` with route data loading by draft ID.
   Read and update the draft through the TanStack DB collection; components
   must not know whether its backing store is Local Storage or D1.
5. **Load references on the editor route.** Fetch only the catalog queries the
   editor needs (`weaponQueries`, `echoQueries`, `echoSetQueries`) and resolve
   selected IDs for display. Do not place full catalog objects in the draft.
6. **Bind edits to document fields.** Frontend controls read/write the typed
   fields in `BuildDraft.payload`. Update one stable ID/value in the collection
   per edit. Keep component-local state limited to transient interaction state.
7. **Derive totals.** Recalculate client-side from the latest draft and catalog
   references. Do not store totals in Local Storage, D1, or Query Collection.
8. **Connect cloud save/open.** On save, validate and convert the draft, then
   call the authenticated create/update server function. On success, reconcile
   the returned `BuildRecord` with the local draft and cloud build collection;
   on failure, preserve the local draft and surface the save error.
9. **Choose the remote collection adapter.** `@tanstack/react-db` and its local
   storage adapter are present. `@tanstack/query-db-collection` is not
   currently listed; if using Query Collection for D1-backed saved builds,
   install a version compatible with the pinned TanStack DB/Query versions.
   Otherwise use the existing server functions and explicit collection
   reconciliation. Scope remote collection IDs/query keys by user, while the
   server derives and enforces the actual owner.

## Frontend Integration Contract (No Visual Design)

- The resonator picker passes a slug; it does not fetch or pass a `Resonator`
  object into the builder.
- The editor consumes `BuildDraft` plus separately loaded catalog references.
- Weapon/echo selectors store IDs/slugs, never catalog object copies.
- Each editable control maps to one documented schema field. Calculated output
  is read-only derived data from the client calculation function.
- Saved-build routes use `buildId`; resonator-group routes use `resonatorSlug`.
- Reuse `src/modules/encore/queries` for game data. Do not duplicate those
  queryOptions in the builder module.
- This plan intentionally does not specify layout, visual components, styling,
  animations, or responsive design.

## Validation and Acceptance

- Selecting a resonator creates a blank local draft containing its slug and
  default config only; no full resonator record is copied or fetched for the
  creation action.
- Two drafts for the same slug have different local IDs and persist
  independently.
- A draft survives refresh in its Local Storage scope and validates on restore.
- Changing a weapon/echo selection stores only the ID and build-specific values.
- Opening a saved D1 record produces the same editor model through the mapper.
- Create/update payloads contain no local ID, owner ID, timestamps, catalog
  records, or computed totals.
- A D1/auth failure does not destroy the locally persisted draft.
- Catalog updates refresh resolved metadata and calculated stats without
  changing the user's selected IDs or document version.
- Test payload validation, empty defaults, conversion round trips, unsupported
  document versions, missing catalog IDs, and pure stat calculations.
- Run `bun run typecheck` and `bun run build`; check Wrangler upload size for
  build-affecting changes.

## Documentation Follow-up

Update `AGENTS.md` when implementation lands: TanStack DB drafts are scoped by
user and local storage schema version; saved builds use user/build identity and
`documentVersion`; catalog freshness is TTL-based.
