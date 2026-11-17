# Builder UI

See the [builder UI guide](../../../../../docs/BUILDER_UI.md) for the feature contract and the
[search integration guide](../../../../../docs/SEARCH_INTEGRATION.md) for source adapters and selection
callbacks.

The editor route supplies an explicit build/session identity and resolves the
local draft for that session, then passes it
to `BuildEditorWorkspace`. The workspace composes the header, preview stage and
sidebar inspector.

## Canvas

`BuildCanvas` and its panels receive the draft and prepared content as props.
`BuildWorkspacePreview` resolves catalog data and supplies the stats, sequences,
skills, weapon properties and echo details. The preview keeps its per-panel
loading states. The canvas grid can also render directly from fixtures.

The layout is a single 10 x 7 grid with 90px rows, a 160px second row and named
areas, declared in `.build-canvas` (`src/styles/components.css`). Each panel declares its area through
`BuildCanvasCard` or `data-canvas-area`.

## Workspace

`components/workspace/` frames the builder with four parts:

| Part    | Role                                                                     |
| ------- | ------------------------------------------------------------------------ |
| Root    | Grid; two columns above `xl`, one column below.                          |
| Canvas  | PanelUI canvas: dot pattern, pointer spotlight and a fixed-height stage. |
| Content | `Canvas.Content`; fills the stage and clips the Flow. It never scrolls.  |
| Rail    | Editor column; above `xl` scrolls with a hidden scrollbar.               |

The stage is the [PanelUI Canvas](../../../../components/panelui/canvas.tsx):
`Canvas.Pattern` draws the dots, `Canvas.Spotlight` lights them, and
`Canvas.Content` holds the preview. The compound follows the same conventions as
the admin `EditableSection` (parts, `data-slot`, native props) but it is
independent: the builder does not import the admin system.

```tsx
<BuildWorkspace.Root>
  <BuildWorkspace.Canvas>
    <BuildWorkspace.Content>
      <BuildWorkspaceStage>
        <BuildWorkspacePreview build={build} resonatorId={resonator.id} />
      </BuildWorkspaceStage>
    </BuildWorkspace.Content>
  </BuildWorkspace.Canvas>
</BuildWorkspace.Root>
```

The sidebar editor inspector owns the editing sections. The build card is a
single node of a PanelUI `Flow`; the stage fits it on mount
and the Flow handles panning, zooming and dragging. The Flow also owns its
controls, so they sit in the stage instead of needing a fixed parent.

## Editor sections

`sections/` holds the editor surfaces. They follow the admin detail split: a
root receives the build, a content component loads the catalog detail, and
progress handlers delegate to operations in `src/modules/build/application`.

| Part         | File                                                 |
| ------------ | ---------------------------------------------------- |
| Root         | `<section>/<section>.tsx`                            |
| Loaded body  | `<section>/components/<section>-section-content.tsx` |
| Mutations    | `<section>/hooks/use-<section>-progress.ts`          |
| Presentation | `<section>/components/<section>-*.tsx`               |

Current sections: `resonator-section/`, `weapon-section/` and `echoes-section/`.

The editor route subscribes to the build collection. Sections receive the draft
via props. Local writes verify the build ID and session ID against the current
row before applying an edit.

## Shared presentation

`../components/` holds the surfaces both layers share: `build-card` (card surface),
`build-card-section` (card, dialog and trigger),
`build-text-header` and `build-echo-card` (one read-only echo slot). Shared
presentation takes everything it paints as props and never reads the build, so
the canvas and the editor sections can reuse it.

## Where to change the design

| What                           | File                                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| Workspace shell                | `components/workspace/build-workspace.tsx`                            |
| Workspace canvas (dots, light) | `src/components/panelui/canvas.tsx`                                   |
| Canvas flow (card node)        | `components/workspace/build-workspace-stage.tsx`                      |
| Canvas grid and areas          | `src/styles/components.css` (`.build-canvas`)                         |
| Canvas panel card surface      | `components/build-canvas/build-canvas-card.tsx`                       |
| Card surface                   | `../components/build-card/build-card.tsx`                             |
| Search dialog and selection | `src/components/blocks/command-search/` |
| Echo slot card                 | `../components/build-echo-card/build-echo-card.tsx`                   |

## Dialogs

- `../components/build-card-section/build-card-section-dialog.tsx` hosts one editor. The
  header and footer stay pinned while the body scrolls inside the viewport.
- Resonator, weapon and echo selection use `CommandSearch` dialogs with local filters.
- Echo pickers belong to `sections/echoes-section/`: an empty card opens the
  search directly, and the selected echo image opens its replacement search.
- The weapon picker belongs to `sections/weapon-section/` and the resonator
  picker to `sections/resonator-section/`; neither is part of the canvas.

## Skills dialog

The skills dialog of the resonator section has two tabs. The skills tab edits
one level per skill with the PanelUI slider (`ResonatorSkillRow`); the passives
tab toggles each passive with `ResonatorSkillNode`, which dims and grays the
unchecked card. Both write through `useResonatorProgress`.

## Independent searches

The builder owns `ResonatorBuildSearch`, `WeaponBuildSearch` and `EchoBuildSearch`
under `searches/`. Admin owns three separate components under catalog presentation.
Each folder has an `index.tsx`, private controls/results, a nuqs filter hook and a
results hook that queries and filters its own source. No generic entity-search
component connects the two consumers.

The only shared search factory is `src/hooks/create-search-filters.ts`. It creates
a hook from nuqs parsers and a runtime scope; it does not render fields or filter
lists. Search scopes keep admin, builder and echo slots separate in the URL.
Closing a dialog clears only that instance's parameters.

`CommandSearch` is a presentation primitive. Each builder search controls its
open state, pending action and close behavior. Result items set
`closeOnSelect={false}`; successful selections close explicitly, while failures
or discarded selections leave the search open.

Builder queries use the canonical catalog. Weapon compatibility stays in
`useWeaponBuildResults`. Echo selection uses `echoQueries.selection()`, including
only sonata ids, names and icons; those fields are used by search and are not added
to the saved build snapshot. No data migrations or compatibility wrappers are
needed for this UI organization.
