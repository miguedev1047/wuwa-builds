# Builder UI

The builder renders two surfaces over the same local build: the **canvas**, a
read-only preview laid out on `BuildCard`, and the **editor sections**, which are
the only places that open dialogs or write to the collection.

## Canvas

`components/build-canvas/` paints the build and nothing else: no triggers, no
pickers, no `updateBuild`. The ESLint config enforces it.

| Panel     | Folder             | Reads                              |
| --------- | ------------------ | ---------------------------------- |
| Resonator | `resonator-panel/` | resonator summary and element      |
| Stats     | `stats-panel/`     | `useBuildStats`                    |
| Skills    | `skills-panel/`    | catalog detail and build passives  |
| Weapon    | `weapon-panel/`    | weapon summary and base stats      |
| Echoes    | `echoes-panel/`    | five slots through `BuildEchoCard` |
| Sequences | `sequences-panel/` | resonator sequences rail           |

Panels never define their own grid placement: `build-canvas-layout.ts` holds the
`md` areas. The canvas is hidden below `md`.

## Editor sections

`sections/` holds the editor surfaces. They follow the admin detail split: a
root resolves the build, a content component loads the catalog detail, the
mutations live in `application/`, and the remaining components receive plain
props.

| Part         | File                                                 |
| ------------ | ---------------------------------------------------- |
| Root         | `<section>/<section>.tsx`                            |
| Loaded body  | `<section>/components/<section>-section-content.tsx` |
| Mutations    | `<section>/application/use-<section>-progress.ts`    |
| Presentation | `<section>/components/<section>-*.tsx`               |

Current sections: `resonator-section/`, `weapon-section/` and `echoes-section/`.

Only the root and the content component read the build collection. Presentation
components never import the store, LocalStorage or the catalog queries, so they
can be rendered with a fixture.

## Shared presentation

`ui/` holds the surfaces both layers share: `build-card` (card surface),
`build-card-section` (card, dialog and trigger), `build-catalog-picker`,
`build-text-header` and `build-echo-card` (one read-only echo slot). Shared
presentation takes everything it paints as props and never reads the build, so
the canvas and the editor sections can reuse it.

## Where to change the design

| What                       | File                                                       |
| -------------------------- | ---------------------------------------------------------- |
| Canvas panel placement     | `components/build-canvas/build-canvas-layout.ts`           |
| Canvas surface and grid    | `components/build-canvas/build-canvas.tsx`                 |
| Card surface               | `ui/build-card/build-card.tsx`                             |
| Picker grid and item state | `ui/build-catalog-picker/build-catalog-picker-variants.ts` |
| Echo slot card             | `ui/build-echo-card/build-echo-card.tsx`                   |

## Dialogs

- `ui/build-card-section/build-card-section-dialog.tsx` hosts one editor. The
  header and footer stay pinned while the body scrolls inside the viewport.
- `ui/build-catalog-picker/build-catalog-picker-dialog.tsx` hosts a picker in a
  standalone dialog. The grid lives on a fixed 50vh area with `no-scrollbar`.
- Echo pickers belong to `sections/echoes-section/`: an empty card opens the
  picker directly and a filled card opens the editor, with a separate change
  action (`echo-picker-dialog.tsx`) for the selected echo.
- The weapon picker belongs to `sections/weapon-section/` and the resonator
  picker to `sections/resonator-section/`; neither is part of the canvas.

## Forte tree

The skills dialog of the resonator section renders the forte tree: five
branches, each with two chained nodes and its skill underneath. The build stores
the ten nodes in reading order, so the first five are the top row and the last
five the bottom row; the skill of branch `i` is the skill at index `i`. Every
skill level is edited with a two-button stepper, never a slider.

## Shared catalog picker

`BuildCatalogPicker<T>` only renders the grid and item shell. Each entity keeps
its own adapter (`ResonatorGrid`, `WeaponPicker`, `EchoPicker`) with its queries,
filtering and selection rules. Do not move build or catalog logic into `ui/`.
