# Encore game data

Read-only game data (characters, weapons, echoes) from the public Encore API. It
powers the admin and builder screens; the builder calculations consume the same
lean payloads.

## API

Base: `https://api-v2.encore.moe/api/{lang}/...` (`es` by default, `en`
available). No auth, CORS enabled.

| Endpoint           | Contents                           |
| ------------------ | ---------------------------------- |
| `character?page=1` | 64 character summaries             |
| `character/{id}`   | full character (lean mapped here)  |
| `weapon`           | 124 weapons                        |
| `weapon/{id}`      | weapon stats and refinement ranks  |
| `echo`             | 319 echoes with their sonata sets  |
| `echo/{id}`        | echo skill and set effects         |

## Cache

- **Server**: 5-minute in-memory dedupe per isolate + 6-hour Cloudflare edge
  cache (`cf.cacheTtl`, `cacheEverything`).
- **Client**: shared query options use `staleTime: 6h`, `gcTime: 24h`.
- Encore data is not versioned by a deploy-time hash; freshness is TTL-based
  and changes with game patches.

## Lean mapping

Dropped to keep payloads small (and because they are lore/text): `Words`,
`Stories`, `Model3D`, `Skins`, `GachaViewInfo`, `SkillInputs`, `favorRole`,
`Goods` (favorite-item lore).

Kept: stats with per-level growth, skills (description, attributes,
multipliers), sequences, passives, tags and images.

Weapons drop model/physics/stand-animation fields and ascension breaches;
echoes drop mesh/location/animation fields. Weapon stats, refinement effects and
echo sonata set effects are kept. The single `Desc` passive is expanded into one
effect per refinement rank (1 to 5).

## D1 catalog

`src/db/schemas` mirrors the same lean payloads 1:1 so the catalog can also live
in D1 (one table per nested collection, every column annotated with the raw
Encore JSON key):

| File            | Tables                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------- |
| `resonators.ts` | `resonators`, `resonator_tags`, `resonator_property_levels`, `resonator_property_growth` |
|                 | `resonators_media`, `resonator_skills`, `resonator_sequences`                            |
|                 | `resonator_passives`                                                                     |
| `weapons.ts`    | `weapons`, `weapon_properties`, `weapon_property_growth`                                 |
|                 | `weapon_refinements`, `weapon_refinement_stats`                                          |
| `echoes.ts`     | `echoes`, `echo_sets`, `echo_set_effects`, `echo_skills`                                 |

`src/modules/encore/infrastructure/catalog-d1.server.ts` writes and reads those
tables as whole documents (`saveCharacter`/`readCharacter`, and the weapon and
echo equivalents), returning the same `Encore*` types the API mapper produces.
Skill attributes, consumes and damage, the passive consume list and both
character and weapon breaches are intentionally not stored: the D1 reader
returns them as empty arrays (weapon breaches are no longer part of the domain
type). Passive descriptions are converted to `value_number` and the D1 reader
returns them as their numeric string. Writes delete and re-insert the entity, so
a game patch never leaves stale child rows behind. `catalog-d1.test.ts` applies
the generated migrations to an in-memory SQLite database and asserts the stored
document round trip.

Weapon refinement stats are the exception to the derived data: Encore only
carries the passive prose, so the builder-critical numbers (`stat_name`,
`stat_number`) are authored by hand. `saveWeapon` reads them before the
delete/re-insert and restores them per refinement rank, so a re-sync never wipes
them.

Two quirks of the real payloads shape the keys:

- Nested Encore IDs (skill, passive, sequence, breach) are only unique inside
  their character, so those tables key on an autoincrement id plus
  `unique(parent, encore_id)`; the original ID is kept in its own column.
- Stat growth levels repeat (96 entries per level-90 stat, ascension steps share
  the level) and CRIT stats report `"5%"` strings while HP/ATK report numbers,
  so growth rows are ordered by `sort_order` and store numbers and strings in
  separate `value_number`/`value_text` columns.
- Each highlighted `Desc` span carries its own `"a/b/c/d/e"` rank list, and
  `DescParams` does not always follow the same order (for example Defier's
  Thorn and Solar Flame, which even ships a four-value list), so the mapper
  expands every span from the span itself and reuses the last value when a rank
  is missing.

Every entity round-trips exactly: a one-off run of all 64 characters, 124
weapons and 319 echoes (≈63k child rows) read back deep-equal to the mapper
output.

There is no scheduled sync yet: rows are created from the admin panel, and the
admin and builder screens read the canonical catalog from D1. Sequence nodes
keep the icon Encore publishes (`NodeIcon`); rows saved before that column
existed get it back with the sequences "sync icons" action, which only writes
the `icon` column.

## Usage

Encore is a decoupled external source: it is read to search and prefill the
admin forms, while the app itself reads its own catalog from D1
(`@/modules/game-data/queries`). That is why every export here is prefixed with
`encore`.

```tsx
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import {
  encoreEchoQueries,
  encoreWeaponQueries,
} from "@/modules/encore/queries/catalogs"

const characters = await queryClient.query(encoreCharacterQueries.list())
const character = await queryClient.query(encoreCharacterQueries.detail(1210))

const weapons = await queryClient.query(encoreWeaponQueries.list())
const weapon = await queryClient.query(encoreWeaponQueries.detail(21010074))

const echoes = await queryClient.query(encoreEchoQueries.list())
const echo = await queryClient.query(encoreEchoQueries.detail(6000038))
```
