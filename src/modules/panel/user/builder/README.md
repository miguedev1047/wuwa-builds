# Builder UI

The new builder composes one surface (`BuildCard`) from five sections. Each
section follows the same shape: a trigger card, an optional dialog, and small
presentation components.

## Editor sections

`sections/` holds the editor sections that live next to the downloadable card.
They follow the admin detail split: a root resolves the build, a content
component loads the catalog detail, and the remaining components receive plain
props.

| Part         | File                                                         |
| ------------ | ------------------------------------------------------------ |
| Root         | `resonator-section/resonator-section.tsx`                    |
| Loaded body  | `resonator-section/components/resonator-section-content.tsx` |
| Mutations    | `resonator-section/application/use-resonator-progress.ts`    |
| Presentation | `resonator-section/components/resonator-*.tsx`               |

Only the root and the content component read the build collection. Presentation
components never import the store, LocalStorage or the catalog queries, so they
can be rendered with a fixture.

## Where to change the design

| What                             | File                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| Section placement in the grid    | `components/build-card/build-card-grid-layout.ts`          |
| Card surface, padding and radius | `ui/build-card/build-card.tsx`                             |
| Section fill/hover state         | `ui/build-card-section/build-card-section-variants.ts`     |
| Picker grid and item state       | `ui/build-catalog-picker/build-catalog-picker-variants.ts` |
| Responsive base grid             | `components/build-card/build-card-grid.tsx`                |
| Section content                  | `components/build-card/<section>/`                         |
| Picker item content and controls | `ui/build-catalog-picker/`                                 |

Sections never define their own grid placement. To move or resize a section,
change its entry in `build-card-grid-layout.ts`; to restyle every card, change
the variants instead of the section files.

## Sections

| Section             | Folder                    | Data                                     |
| ------------------- | ------------------------- | ---------------------------------------- |
| Resonator info      | `resonator-info-section/` | level and sequence                       |
| Stats               | `stats-section/`          | `useBuildStats`                          |
| Skills and passives | `skills-section/`         | catalog detail and build passives        |
| Weapon              | `weapon-section/`         | compatible weapons, level and refinement |
| Echo slots          | `echo-slots-section/`     | five slots, set, main stat and substats  |

## Dialogs

- `ui/build-card-section/build-card-section-dialog.tsx` hosts one section. The
  header and footer stay pinned while the body scrolls inside the viewport.
- `ui/build-catalog-picker/build-catalog-picker-dialog.tsx` hosts a picker in a
  standalone dialog. The grid lives on a fixed 50vh area with `no-scrollbar`.
- Echo and weapon pickers live on the card itself: the card action
  (`echo-picker-dialog.tsx`, `weapon-picker-dialog.tsx`) opens the selection
  dialog, and an empty card opens it directly. Selection never nests inside the
  property-editor dialog.

## Shared catalog picker

`BuildCatalogPicker<T>` only renders the grid and item shell. Each entity keeps
its own adapter (`ResonatorGrid`, `WeaponPicker`, `EchoPicker`) with its queries,
filtering and selection rules. Do not move build or catalog logic into `ui/`.
