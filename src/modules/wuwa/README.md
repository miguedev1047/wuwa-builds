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
│   └── resonators-file-store.server.ts # persistencia JSON
├── server/
│   └── resonators.ts                 # server functions (TanStack Start)
└── cli/
    └── scrape.ts                     # CLI de desarrollo
```

Todo lo que toca filesystem o red lleva sufijo `.server.ts`, así que el
import-protection de TanStack Start impide que acabe en el bundle del cliente.

## Datos

Se escriben en `src/data/wuwa-resonators` (ignorado por git):

- `<slug>.json` por personaje (perfil, builds, stats, sinergias, ...).
- `index.json` con el roster y sus tiers.

La ruta se puede sobreescribir con `WUWA_RESONATORS_DIR` o con `--out` en el CLI.

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

## Uso desde la app

```tsx
import {
  getResonators,
  getResonator,
} from "@/modules/wuwa/server/resonators"

// En un loader o componente
const index = await getResonators()
const aalto = await getResonator({ data: { slug: "aalto" } })
```

Las entradas se validan con zod (`application/schemas.ts`) mediante
`.validator(...)`, que acepta cualquier Standard Schema.
