# Builder UI guide

Cimientos del builder listos. Este documento es la guía para ir construyendo la
UI sin romper el contrato de datos.

## Flujo actual

1. `/panel/new-build` lista personajes de Encore.
2. Al hacer click en uno, se crea un `BuildDraft` local, se inserta en la
   colección de TanStack DB y se navega a `/panel/builder/$draftId`.
3. `/panel/builder/$draftId` lee el borrador de la colección y permite editarlo.
4. El borrador vive en Local Storage, con scope por `session.user.id`.
5. Guardar en D1 todavía no está conectado a la UI: usa los server functions que
   ya existen.

## Contrato de datos

### `BuildDraft`

```ts
{
  id: string // clave local de la colección
  savedBuildId: string | null // null hasta guardar en D1
  characterId: number // ID numérico de Encore
  name: string // puede estar vacío en local
  documentVersion: 1
  payload: BuildPayload
  createdAt: string // ISO
  updatedAt: string // ISO
}
```

### `BuildPayload` (V1)

```ts
{
  resonator: {
    level: number // 1..90
    sequenceRank: number // 0..6 (S0..S6)
    skillLevels: {
      skillId: number
      level: number
    }
    ;[] // level 1..10
  }
  weapon: {
    weaponId: number | null // ID de Encore
    level: number // 1..90
    refinementRank: number // 1..5
  }
  echoLoadout: [EchoSlot, EchoSlot, EchoSlot, EchoSlot, EchoSlot]
  mainEchoSlot: 0 | 1 | 2 | 3 | 4 | null
  notes: string
}

type EchoSlot = {
  echoId: number | null // ID de Encore
  level: number // 0..25
  mainStatId: string | null // clave canónica, ej. "atk_percent"
  sonataId: number | null // solo si el usuario elige set por eco
  substats: { statId: string; value: number }[] // máx. 5
}
```

Decisiones de V1:

- **Secuencias**: `sequenceRank` lineal (0–6), no seis booleanos.
- **Sets de eco**: se derivan del eco cuando sea posible; `sonataId` solo se
  guarda si el usuario elige uno explícito.
- **Substats**: `value` en unidades de display. Porcentajes como puntos
  (`6.3` = 6.3%), planos como valor directo. Nunca guardes etiquetas localizadas.
- **Skills**: `skillId` es el `SkillId` numérico de Encore. El builder siembra
  `skillLevels` desde el detalle del personaje con
  `createDefaultSkillLevels(character.skills)` en el orden del juego: Ataque
  normal, Habilidad de resonancia, Circuito del Forte, Liberación de resonancia,
  Habilidad Intro. Por defecto nivel 10; pasa `1` como segundo argumento si
  quieres empezar en nivel 1.
- **Main echo**: se representa por índice en `echoLoadout`; no hay `mainEchoId`
  duplicado.
- **Nada de** nombres, iconos, descripciones ni totales calculados dentro del
  payload.

## Colección local

Provider en el layout del panel:

```tsx
// src/routes/(panel)/panel/route.tsx
<BuildDraftsProvider scopeId={session.user.id}>
  <Outlet />
</BuildDraftsProvider>
```

Hook para componentes:

```tsx
import {
  useBuildDraftCollection,
  type BuildDraftCollection,
} from "@/modules/builds/client/build-drafts-provider"

const collection = useBuildDraftCollection()
// null en SSR / hasta que monta el cliente
```

Leer y editar:

```tsx
import { eq } from "@tanstack/db"
import { useLiveQuery } from "@tanstack/react-db"

const { data: draft } = useLiveQuery((q) =>
  q
    .from({ draft: collection })
    .where(({ draft }) => eq(draft.id, draftId))
    .findOne()
)

collection.update(draftId, (current) => {
  current.name = name
  current.updatedAt = new Date().toISOString()
})
```

Reglas:

- No accedas a `localStorage` desde componentes; usa la colección.
- No dupliques la colección por pantalla. El provider ya scopea por usuario.
- Al cambiar de cuenta o cerrar sesión el provider se desmonta y limpia.

## Rutas

| Ruta                              | Uso                                          |
| --------------------------------- | -------------------------------------------- |
| `/panel/new-build`                | Selector de personaje; crea el draft local   |
| `/panel/builder/$draftId`         | Editor de un borrador local                  |
| `/panel/my-builds`                | Lista de borradores/builds (pendiente UI)    |
| `/panel/my-builds/b/$characterId` | Grupo de builds por personaje (pendiente UI) |

## Pantallas a construir

### `/panel/my-builds`

- **Implementado**: `LocalBuildList`
  (`src/modules/panel/user/my-builds/components/local-build-list.tsx`) lista los
  drafts locales con `useLiveQuery`, resuelve el nombre/icono del personaje con
  `characterQueries.list()` y enlaza a `/panel/builder/$draftId`.
- Ordena por `updatedAt` descendente y permite borrar el draft local.
- Estado vacío con acceso a “Nueva Build”.
- Pendiente: listar builds de D1 con `getMyBuilds()` y reconciliar con la
  colección local.

### `/panel/builder/$draftId`

Secciones sugeridas, cada una ligada a campos concretos:

1. **Header**
   - Nombre editable → `draft.name`.
   - `characterId` + datos del personaje desde
     `characterQueries.detail(draft.characterId)`.
   - Estado local/guardado (`savedBuildId`).
   - Acciones: guardar, volver.

2. **Resonador** → `payload.resonator`
   - Nivel (`level`) 1-90.
   - Secuencia (`sequenceRank`) 0-6.
   - Skills: usa
     `getUpgradeableSkills(character.skills)` para renderizar en orden de juego
     (Normal, Resonance Skill, Forte, Liberation, Intro) y
     `createDefaultSkillLevels(character.skills)` para sembrar
     `skillLevels`. El builder ya lo hace cuando llega el detalle; no hace falta
     fetchear el personaje en `handleNewBuild`.

3. **Arma** → `payload.weapon`
   - Selector con `weaponQueries.list()` filtrado por `character.weaponType`.
   - Nivel 1–90 y refinamiento 1–5.
   - Detalle con `weaponQueries.detail(id)`.

4. **Ecos** → `payload.echoLoadout` y `payload.mainEchoSlot`
   - 5 slots; selector con `echoQueries.list()`.
   - Nivel 0–25.
   - Main stat: `SELECT_ECHO_MAIN_STATS` (`src/modules/builds/constants/stats.ts`).
   - Substats: `SELECT_SUBSTATS_OPTIONS` (`constants/substats.ts`), máximo 5.
   - Set: `echoQueries.detail(id).sets`; guarda `sonataId` solo si el usuario
     elige uno.
   - Marcar main echo con `mainEchoSlot`.

5. **Stats derivados**
   - Llamar a `calculateBuildStats(payload, reference)`.
   - No guardar el resultado en el draft ni en D1.
   - `reference` se construye desde el catálogo:
     - base del personaje al nivel elegido;
     - ATK base y secundario del arma al nivel elegido;
     - `echoMainStats` alineado con los 5 slots;
     - `extraBonuses` para sets u otros efectos ya normalizados.
   - Nombres de propiedades de Encore → claves canónicas:
     `PS → hp`, `ATQ → atk`, `DEF → def`, `Prob. Crit → crit_rate`,
     `Daño Crit → crit_dmg`, `Rec Energía → energy_regen`,
     `Bono de curación → healing_bonus`.
   - En armas, la primera propiedad es el ATK base y la segunda el stat
     secundario; usa la misma tabla para el secundario.
   - Para main stats de eco, `SELECT_ECHO_MAIN_STATS` trae 6 valores por stat
     (tiers de nivel 0/5/10/15/20/25). Elige el índice según el nivel del eco.
   - Stat keys canónicas en
     `src/modules/builds/domain/calculate-build-stats.ts`.

6. **Notas** → `payload.notes`.

## Guardar / abrir en D1

Convertidores existentes:

- `buildRecordToDraft(record)`
- `buildDraftToCreateInput(draft)`
- `buildDraftToUpdateInput(draft)`

Guardar nuevo:

```ts
const input = buildDraftToCreateInput(draft) // exige name válido
const record = await createBuild({ data: input })
collection.update(draft.id, (current) => {
  current.savedBuildId = record.id
  current.updatedAt = new Date().toISOString()
})
```

Actualizar:

```ts
const record = await updateBuild({
  data: buildDraftToUpdateInput(draft),
})
```

Abrir guardado:

```ts
const record = await getBuild({ data: { buildId } })
if (record) {
  const draft = buildRecordToDraft(record)
  collection.insert(draft)
  navigate({ to: "/panel/builder/$draftId", params: { draftId: draft.id } })
}
```

- Si falla D1/auth, conserva el draft local y muestra el error.
- El owner siempre sale de la sesión en el servidor; nunca lo envíes desde el
  cliente.

## Reglas para no romper el contrato

- IDs numéricos de Encore en todo el documento.
- Nada de objetos completos de catálogo dentro del draft.
- Nada de totales calculados persistidos.
- No dupliques `queryOptions` de Encore; importa desde
  `src/modules/encore/queries`.
- Mantén `documentVersion` y la versión de Local Storage separadas.
- Los drafts locales pueden estar incompletos; el guardado exige nombre y
  payload válido.

## Comandos

```bash
bun run dev
bun run typecheck
bun test
bun run build
```

## Orden recomendado de trabajo

1. Guardar/actualizar desde el builder (nombre + payload).
2. Listado de drafts locales en `/panel/my-builds`.
3. Editor de resonador/arma.
4. Editor de ecos + main echo.
5. Stats derivados.
6. Cargar builds de D1 y reconciliar.
7. Colección remota/optimistic si hace falta.
