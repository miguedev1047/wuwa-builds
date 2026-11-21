# Builder UI guide

Guía del builder. Las builds viven en D1 y se leen con una Query Collection de
TanStack DB; el editor trabaja con el documento hidratado y guarda cada edición.

## Flujo actual

1. `/panel/my-builds` tiene “Nueva Build”, que crea una build vacía y abre
   `/panel/builder/$buildId`. La creación no consulta el catálogo.
2. `/panel/builder/$buildId` es la ruta canónica del editor. Si la build no
   existe o pertenece a otra cuenta, muestra “Build no encontrada”.
3. Una build vacía muestra el selector de resonador. Al elegir o cambiar uno, se
   consulta `characterQueries.detail(id)`, se actualizan skills/pasivas y se
   reinicia el arma.
4. `/panel/my-builds` separa las builds con resonador (“Tus builds”) de las que
   todavía no tienen uno (“Builds sin resonador”).
5. Tocar un resonador abre un Sheet con sus builds. Las builds sin resonador se
   listan directamente en la página. Cada card enlaza a la ruta canónica por
   `buildId`; renombrar y eliminar pertenecen al editor.

## Contrato `BuildProps`

```ts
interface BuildProps {
  buildId: string
  userId: string
  backgroundIndex: number | null
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
    echoSetId: number | null
    mainStatStat: string
    mainStatLabel: string
    mainStatValue: number
    level: number // 0..25
    cost: number
    substats: {
      index: number
      valueStat: string
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
- `echoSetId`, `mainStatStat` y `valueStat` son ids canónicos; los labels se
  derivan del catálogo y de `constants/stats.ts`.
- `selectedEditorSection` no es parte del documento: vive en
  `EditorSectionProvider` y se resetea al abrir otra build.
- Siempre hay 5 slots de eco y 5 substats por eco.
- `createdAt` / `updateAt` son strings ISO.

## Colección y guardado

- `builds` es una Query Collection de TanStack DB
  (`src/modules/build/client/builds-collection.ts`), creada por usuario con
  `id: builds:<userId>` y `queryKey: ["builds", userId]`.
- Los loaders de Mis builds y del editor precargan la colección mediante
  el `DbClient` del router. Los hooks resuelven el mismo descriptor.
- La lectura hidrata las filas de D1 con el catálogo en un solo lote
  (`hydrate-builds.ts`) y recién después mapea al documento del editor.
- Las escrituras son optimistas. Cada edición se guarda en orden mediante
  `updateBuild`. Los tres handlers reconcilian con `refetch`.
- El estado de UI de la sección activa vive en
  `src/modules/build/presentation/editor/state/editor-section-context.tsx`, no
  en la colección.
- El router hidrata la colección precargada al renderizar en el servidor.
- Las live queries filtran por `userId` (el id de Better Auth); nunca confíes
  solo en `buildId`. No uses el session id: cambia en cada inicio de sesión.
- Los rosters usan `where`, `groupBy`, `groupKeys` y `count`; no agrupes arrays
  a mano.

## Rutas

| Ruta                      | Uso                                      |
| ------------------------- | ---------------------------------------- |
| `/panel/builder/$buildId` | Editor canónico                          |
| `/panel/my-builds`        | Rosters con Sheet y builds sin resonador |

## Secciones del editor

- **Resonador**: selector/portrait, nivel, secuencias y un diálogo de
  habilidades con tabs y sliders.
- **Arma**: selector, nivel y refinamiento.
- **Ecos**: 5 slots con eco, set, main stat, nivel, substats y eco principal.
- **Stats derivados**: se calculan al vuelo; no se persisten.

Las secciones del editor viven en `src/modules/build/presentation/editor/sections/`
(hoy `resonator-section/`, `weapon-section/` y `echoes-section/`) y se
dividen en raíz, cuerpo cargado, mutaciones y componentes de presentación. El
lienzo de `components/build-canvas/` es una superficie de solo lectura: un grid
de 10 columnas × 8 filas con áreas nombradas y filas de 90px (`.build-canvas` en
`src/styles/components.css`) que pinta la build y nunca abre diálogos, pickers ni escribe en
la colección. La UI se monta en `components/workspace/`: un Canvas de PanelUI
(`src/components/panelui/canvas.tsx`) con patrón de puntos y spotlight a la
izquierda, y el rail de secciones a la derecha; por encima de `xl` cada panel
scrollea por su cuenta, por debajo se apilan. La tarjeta es un nodo de un `Flow`
de PanelUI: el stage la encaja al montar y el Flow se encarga del pan, el zoom y
el arrastre, sin scroll dentro del canvas. Las dos capas comparten la
presentación de `build/presentation/components/` (por ejemplo `build-echo-card`).

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
- Los componentes no deben importar la colección directamente: leen con
  `useBuildCollection` y escriben con `useBuildStore`.

## Guardar en D1

- Una build es una fila de `builds`: `id` (UUID del cliente), `user_id`,
  `character_id` nullable, `name`, `payload` JSON y `document_version` (hoy 2).
- El payload guarda solo ids y valores: `weaponId`, `echoId`, `mainStatId`,
  `sonataId`, `statId`, niveles, `backgroundIndex` y las pasivas habilitadas.
  Los labels, `data` y `cost` se hidratan desde el catálogo al leer.
- `src/modules/build/application/build-document.ts` es el único mapper en los
  dos sentidos; no agregues conversiones en componentes.
- `character_id` queda en `null` mientras la build no tiene resonador; la
  columna se actualiza junto con el payload al elegir o cambiar de personaje.
- Crear una build es idempotente: el cliente manda su `buildId` y un reintento
  devuelve la fila existente en vez de duplicarla.
- Cada edición ejecuta un único `UPDATE` de la fila de la build.

## Comandos

```bash
bun run dev
bun run typecheck
bun test
bun run build
```
