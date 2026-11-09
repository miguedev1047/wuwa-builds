# Builder UI

The new builder composes one surface (`BuildCard`) from five sections. Each
section follows the same shape: a trigger card, an optional dialog, and small
presentation components.

## Where to change the design

| What | File |
| --- | --- |
| Section placement in the grid | `components/build-card/build-card-grid-layout.ts` |
| Card surface, padding and radius | `ui/build-card/build-card.tsx` |
| Section fill/hover state | `ui/build-card-section/build-card-section-variants.ts` |
| Picker grid and item state | `ui/build-catalog-picker/build-catalog-picker-variants.ts` |
| Responsive base grid | `components/build-card/build-card-grid.tsx` |
| Section content | `components/build-card/<section>/` |
| Picker item content and controls | `ui/build-catalog-picker/` |

Sections never define their own grid placement. To move or resize a section,
change its entry in `build-card-grid-layout.ts`; to restyle every card, change
the variants instead of the section files.

## Sections

| Section | Folder | Data |
| --- | --- | --- |
| Resonator info | `resonator-info-section/` | level and sequence |
| Stats | `stats-section/` | `useBuildStats` |
| Skills and passives | `skills-section/` | catalog detail and build passives |
| Weapon | `weapon-section/` | compatible weapons, level and refinement |
| Echo slots | `echo-slots-section/` | five slots, set, main stat and substats |

## Shared catalog picker

`BuildCatalogPicker<T>` only renders the grid and item shell. Each entity keeps
its own adapter (`ResonatorGrid`, `WeaponPicker`, `EchoPicker`) with its queries,
filtering and selection rules. Do not move build or catalog logic into `ui/`.
