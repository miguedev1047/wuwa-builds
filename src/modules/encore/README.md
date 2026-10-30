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
| `weapon/{id}`      | weapon stats, effect and ascension |
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
multipliers), sequences, passives, breaches, tags and images.

Weapons drop model/physics/stand-animation fields; echoes drop
mesh/location/animation fields. Their stats, effects, ascension data and sonata
set effects are kept.

## D1 catalog

`src/db/schemas` mirrors the same lean payloads 1:1 so the catalog can also live
in D1 (one table per nested collection, every column annotated with the raw
Encore JSON key):

| File            | Tables                                                                      |
| --------------- | --------------------------------------------------------------------------- |
| `resonators.ts` | `resonators`, `resonator_tags`, `resonator_properties`, `resonator_property_growth` |
|                 | `resonator_skills`, `resonator_skill_attributes`, `resonator_sequences`      |
|                 | `resonator_passives`, `resonator_passive_items`, `resonator_breaches`        |
| `weapons.ts`    | `weapons`, `weapon_properties`, `weapon_property_growth`, `weapon_breaches`  |
| `echoes.ts`     | `echoes`, `echo_sets`, `echo_set_effects`, `echo_skills`                     |

`src/modules/encore/infrastructure/catalog-d1.server.ts` writes and reads those
tables as whole documents (`saveCharacter`/`readCharacter`, and the weapon and
echo equivalents), returning the same `Encore*` types the API mapper produces.
Writes delete and re-insert the entity, so a game patch never leaves stale
child rows behind. `catalog-d1.test.ts` applies the generated migrations to an
in-memory SQLite database and asserts the round trip is lossless.

Two quirks of the real payloads shape the keys:

- Nested Encore IDs (skill, passive, sequence, breach) are only unique inside
  their character, so those tables key on an autoincrement id plus
  `unique(parent, encore_id)`; the original ID is kept in its own column.
- Stat growth levels repeat (96 entries per level-90 stat, ascension steps share
  the level) and CRIT stats report `"5%"` strings while HP/ATK report numbers,
  so growth rows are ordered by `sort_order` and store numbers and strings in
  separate `value_number`/`value_text` columns.

Every entity round-trips exactly: a one-off run of all 64 characters, 124
weapons and 319 echoes (≈63k child rows) read back deep-equal to the mapper
output.

Nothing populates these tables yet: there is no scheduled sync or admin action,
so the screens still read the live API.

## Usage

```tsx
import { characterQueries } from "@/modules/encore/queries/characters"
import { echoQueries, weaponQueries } from "@/modules/encore/queries/catalogs"

const characters = await queryClient.query(characterQueries.list())
const character = await queryClient.query(characterQueries.detail(1210))

const weapons = await queryClient.query(weaponQueries.list())
const weapon = await queryClient.query(weaponQueries.detail(21010074))

const echoes = await queryClient.query(echoQueries.list())
const echo = await queryClient.query(echoQueries.detail(6000038))
```
