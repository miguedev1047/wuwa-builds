# Builder UI

The builder renders two surfaces over the same local build: the **canvas**, a
read-only preview laid out on `BuildCard`, and the **editor sections**, which are
the only places that open dialogs or write to the collection. Both live inside
the workspace shell (`components/workspace/`).

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

The layout is a single 10 x 8 grid with 90px rows and named areas, declared in
`.build-canvas` (`src/styles.css`); each panel only declares its area through
`BuildCanvas.Card`. Panels never use column or row line numbers. The canvas is
rendered inside the workspace canvas and scaled there, so it is no longer hidden
below `md`.

```tsx
<BuildCanvas.Root>
  <BuildCanvas.Sequences />
  <BuildCanvas.Resonator />
  <BuildCanvas.Stats />
  <BuildCanvas.Skills />
  <BuildCanvas.Weapon />
  <BuildCanvas.Echoes />
</BuildCanvas.Root>
```

## Workspace

`components/workspace/` frames the builder with four parts:

| Part    | Role                                                                    |
| ------- | ----------------------------------------------------------------------- |
| Root    | Grid; two columns above `xl`, one column below.                         |
| Canvas  | PanelUI canvas: dot pattern, pointer spotlight and frame.               |
| Content | `Canvas.Content`; scrolls inside the canvas and centers the build card. |
| Rail    | Editor column; above `xl` scrolls with a hidden scrollbar.              |

The stage is the [PanelUI Canvas](../../../../components/panelui/canvas.tsx):
`Canvas.Pattern` draws the dots, `Canvas.Spotlight` lights them, and
`Canvas.Content` holds the preview. The compound follows the same conventions as
the admin `EditableSection` (parts, `data-slot`, native props) but it is
independent: the builder does not import the admin system.

```tsx
<BuildWorkspace.Root>
  <BuildWorkspace.Canvas>
    <BuildWorkspace.Content>
      <BuildCanvas.Root>...</BuildCanvas.Root>
    </BuildWorkspace.Content>
  </BuildWorkspace.Canvas>

  <BuildWorkspace.Rail>...</BuildWorkspace.Rail>
</BuildWorkspace.Root>
```

Above `xl` the page does not scroll: the canvas and the rail scroll
independently. Below `xl` the rail falls under the canvas and the page scrolls.
The canvas scale is a CSS variable (`--build-canvas-preview-scale`, default
0.75) declared in `.build-canvas-preview`.

The editor sections render as-is in the rail; their compact, rail-aware UI is a
pending pass, so expect visual breakage until that pass lands.

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

| What                           | File                                                       |
| ------------------------------ | ---------------------------------------------------------- |
| Workspace shell                | `components/workspace/build-workspace.tsx`                 |
| Workspace canvas (dots, light) | `src/components/panelui/canvas.tsx`                        |
| Preview scale                  | `src/styles.css` (`.build-canvas-preview`)                 |
| Canvas grid and areas          | `src/styles.css` (`.build-canvas`)                         |
| Canvas panel card surface      | `components/build-canvas/build-canvas-card.tsx`            |
| Canvas surface and grid        | `components/build-canvas/build-canvas.tsx`                 |
| Card surface                   | `ui/build-card/build-card.tsx`                             |
| Picker grid and item state     | `ui/build-catalog-picker/build-catalog-picker-variants.ts` |
| Echo slot card                 | `ui/build-echo-card/build-echo-card.tsx`                   |

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

## Skills dialog

The skills dialog of the resonator section has two tabs. The skills tab edits
one level per skill with the PanelUI slider (`ResonatorSkillRow`); the passives
tab toggles each passive with `ResonatorSkillNode`, which dims and grays the
unchecked card. Both write through `useResonatorProgress`.

## Shared catalog picker

`BuildCatalogPicker<T>` only renders the grid and item shell. Each entity keeps
its own adapter (`ResonatorPicker`, `WeaponPicker`, `EchoPicker`) with its queries,
filtering and selection rules. Do not move build or catalog logic into `ui/`.
