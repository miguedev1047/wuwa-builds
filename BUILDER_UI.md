# Builder UI guide

Guía del builder local. La persistencia actual es LocalStorage; el guardado en
D1 sigue pendiente.

## Flujo actual

1. `/panel/my-builds` tiene “Nueva Build”, que crea una build vacía y abre
   `/panel/builder/$buildId`. La creación no consulta el catálogo.
2. `/panel/builder/$buildId` es la ruta canónica del editor. Si la build no
   existe o pertenece a otra sesión, muestra “Build no encontrada”.
3. Una build vacía muestra el selector de resonador. Al elegir o cambiar uno, se
   consulta `characterQueries.detail(id)`, se actualizan skills/pasivas y se
   reinicia el arma.
4. `/panel/my-builds` agrupa las builds por resonador con live queries. Las
   builds sin resonador aparecen en “Sin resonador”.
5. `/panel/builder/r/$rosterId` lista las builds de un resonador y enlaza a la
   ruta canónica por `buildId`.

## Contrato `BuildProps`

```ts
interface BuildProps {
  buildId: string
  sessionId: string
  name: string
  resonator: {
    level: number // 1..90
    sequency: number // 0..6
    data: CharacterSummary | null
    skills: { id: number; skillId: number; level: number }[]
    passives: {
      id: number
      passiveId: number
      name: string
      value: number
      icon: string
      type: "skill" | "passive"
      enabled: boolean
    }[]
  }
  weapon: {
    level: number // 1..90
    refinament: number // 1..5
    data: WeaponSummary | null
  }
  echoes: {
    data: EchoSummary | null
    index: number
    echoSet: string
    mainStatLabel: string
    mainStatValue: number
    level: number // 0..25
    cost: number
    substats: {
      index: number
      valueLabel: string
      valueNumber: number
    }[]
  }[]
  createdAt: string
  updateAt: string
}
```

- `resonator.data` es el resumen del catálogo, no el detalle completo.
- El detalle lo posee `game-data` y se pide con `characterQueries.detail(id)`.
- Siempre hay 5 slots de eco y 5 substats por eco.
- `createdAt` / `updateAt` son strings ISO.

## Colección local

- `buildCollection` es una colección de TanStack DB respaldada por LocalStorage
  (`src/modules/builds/infrastructure/local-storage`).
- Las pantallas usan `src/modules/builds/client/build-store` o el hook
  `useBuildCollection`, nunca la implementación de infraestructura.
- Las rutas que leen la colección usan `ssr: false`.
- Las live queries filtran por `sessionId`; nunca confíes solo en `buildId`.
- Los rosters usan `where`, `groupBy`, `groupKeys` y `count`; no agrupes arrays
  a mano.

## Rutas

| Ruta                         | Uso                            |
| ---------------------------- | ------------------------------ |
| `/panel/builder/$buildId`    | Editor canónico                |
| `/panel/builder/r/$rosterId` | Builds de un resonador         |
| `/panel/my-builds`           | Rosters y builds sin resonador |

## Secciones del editor

- **Resonador**: selector/portrait, nivel, secuencia y habilidades con el árbol
  de pasivas.
- **Arma**: selector, nivel y refinamiento.
- **Ecos**: 5 slots con eco, set, main stat, nivel, substats y eco principal.
- **Stats derivados**: se calculan al vuelo; no se persisten.

Las secciones del editor viven en `src/modules/panel/user/builder/sections/`
(hoy `resonator-section/`, `weapon-section/` y `echoes-section/`) y se
dividen en raíz, cuerpo cargado, mutaciones y componentes de presentación. El
lienzo de `components/build-canvas/` es una superficie de solo lectura: un grid
de 10 columnas × 8 filas con áreas nombradas y filas de 90px (`.build-canvas` en
`src/styles.css`) que pinta la build y nunca abre diálogos, pickers ni escribe en
la colección. La UI se monta en `components/workspace/`: stage con fondo de
puntos a la izquierda y rail de secciones a la derecha; por encima de `xl` cada
panel scrollea por su cuenta, por debajo se apilan. El canvas se centra en el
stage al 75 % (`.build-canvas-preview`). Las dos capas comparten la presentación
de `ui/` (por ejemplo `build-echo-card`).

## Reglas

- No guardes `CharacterDetail` completo dentro de cada build.
- Usa las query options compartidas de `game-data`; no dupliques keys.
- `list()` para selectores; `detail(id)` para el elemento elegido.
- Precarga el detalle en hover/focus/touch con la misma query.
- No cargues listas completas solo para buscar un elemento por ID.
- Al cambiar de resonador, reinicia skills, pasivas y arma.
- Al cambiar de eco, limpia main stat y substats dependientes.
- No uses Encore como fallback si el catálogo D1 está vacío.
- No importes `src/modules/encore` desde el builder.
- Los componentes no deben importar LocalStorage directamente.

## Guardar en D1

Pendiente. La UI local todavía no está conectada a los server functions de D1.

## Comandos

```bash
bun run dev
bun run typecheck
bun test
bun run build
```
