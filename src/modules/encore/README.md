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
