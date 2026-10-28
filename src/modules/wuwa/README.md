# Dominio: Wuthering Waves

Datos de resonadores (builds de Prydwen) y scraper. Sigue una separación DDD
ligera: dominio puro, casos de uso, infraestructura y una capa de entrada
(server functions + CLI).

## Estructura

```
src/modules/wuwa/
├── domain/
│   └── resonator.ts                  # tipos puros (Resonator, ResonatorIndex, ...)
├── application/
│   ├── schemas.ts                    # contratos de entrada (zod)
│   ├── read-resonators.server.ts     # casos de uso de lectura
│   └── scrape-resonators.server.ts   # caso de uso de scraping
├── infrastructure/
│   ├── prydwen/
│   │   ├── http.server.ts            # transporte (curl + reintentos)
│   │   ├── flight.server.ts          # parser del payload RSC
│   │   ├── characters-page.server.ts # índice de personajes (HTML)
│   │   └── mapper.server.ts          # payload de Prydwen -> modelo de dominio
│   ├── resonators-file-store.server.ts # persistencia JSON (scraper, solo Node)
│   └── resonators-bundle.server.ts     # JSON empaquetado en build (runtime)
├── server/
│   └── resonators.ts                 # server functions (TanStack Start)
└── cli/
    └── scrape.ts                     # CLI de desarrollo
```

Todo lo que toca filesystem o red lleva sufijo `.server.ts`, así que el
import-protection de TanStack Start impide que acabe en el bundle del cliente.

## Datos

Se escriben en `src/data/wuwa-resonators` y **se versionan en git** (se refrescan
a mano ~1 vez al mes):

- `<slug>.json` por personaje (perfil, builds, stats, sinergias, ...).
- `index.json` con el roster y sus tiers.

Para no ensuciar el diff, el scraper compara el JSON nuevo con el guardado
ignorando `fetchedAt` y **no reescribe el archivo si no cambió nada real**: el
commit mensual solo muestra los personajes que Prydwen tocó.

`WUWA_RESONATORS_DIR` y `--out` solo cambian dónde escribe el scraper. En
runtime no se lee del disco: los JSON se empaquetan en el bundle del servidor
con `import.meta.glob` (ver `infrastructure/resonators-bundle.server.ts`). Eso
es obligatorio en Cloudflare Workers, donde workerd no tiene `node:fs`, y de
paso hace que funcione igual en Node. Consecuencia: tras re-scrapear hay que
recompilar/desplegar para que el runtime vea los datos nuevos.

### Cloudflare Workers

- El SSR corre en workerd: sin `node:fs` ni `node:child_process`. El scraper
  sigue siendo local (`bun run scrape`), nunca se ejecuta en el Worker.
- Los JSON viajan en el bundle del servidor: ~3.5 MB en crudo, **~0.9 MB gzip**.
  El upload total con Wrangler queda en ~1.1 MiB comprimido, por debajo del
  límite de 3 MiB del plan gratuito (10 MiB en paid).
- La lectura del índice y de cada personaje están en módulos `.server.ts`, así
  que no llegan al bundle del cliente.

## Refrescar los datos

```bash
bun run scrape                  # incremental: solo baja los que faltan
bun run scrape --force          # vuelve a bajar todo
bun run scrape --only aalto,carlotta
bun run scrape --limit 5 --concurrency 2 --delay 800
bun run scrape --out src/data/otra-carpeta
```

Solo funciona en desarrollo: el CLI aborta con `NODE_ENV=production` y la server
function `scrapeResonators` comprueba `import.meta.env.DEV`.

### Por qué `curl`

Prydwen está detrás de Cloudflare: `fetch` de Node/Bun recibe un 403
(`Just a moment...`) por el fingerprint TLS. `curl` con un `User-Agent` de
navegador sí devuelve el HTML, y no añade dependencias.

### De dónde salen los datos

La web es Next.js (App Router) y no tiene API pública. Cada página renderiza en
servidor el objeto de props de sus componentes cliente y lo manda dentro del
payload RSC (`self.__next_f.push(...)`). El parser extrae ese objeto en vez de
leer el DOM, así que los valores son exactamente los que muestra la página.
Los textos largos (`review`, `rotations`) llegan como filas `T` separadas y se
resuelven con `createTextLookup`.

## Caché

`src/lib/query.tsx` usa `staleTime: "static"`: los datos solo cambian al
re-scrapear y desplegar, así que no hay refetch por mount/focus/reconnect.

Las query keys (`queries/keys.ts`) llevan delante `WUWA_DATA_VERSION`, un hash
del `index.json` inyectado en build desde `vite.config.ts`:

```ts
;["wuwa", WUWA_DATA_VERSION, "resonators"][
  ("wuwa", WUWA_DATA_VERSION, "resonators", slug)
]
```

Así, al desplegar datos nuevos cambian todas las keys y cualquier caché
(memoria, y en el futuro TanStack DB/SQLite) queda invalidada sin lógica extra.
Tras re-scrapear en local hay que reiniciar el dev server para recalcular el
hash.

## Uso desde la app

```tsx
import { getResonators, getResonator } from "@/modules/wuwa/server/resonators"

// En un loader o componente
const index = await getResonators()
const aalto = await getResonator({ data: { slug: "aalto" } })
```

Las entradas se validan con zod (`application/schemas.ts`) mediante
`.validator(...)`, que acepta cualquier Standard Schema.
