/**
 * Grid placement of each build card section.
 *
 * Change these classes to move or resize a section without touching its
 * component. Mobile uses one column; `md` restores the desktop layout.
 */
export const buildCardSectionAreas = {
  resonator: "md:col-start-1 md:col-end-7 md:row-start-1 md:row-end-2",
  stats: "md:col-start-1 md:col-end-7 md:row-start-2 md:row-end-7",
  skills: "md:col-start-7 md:col-end-14 md:row-start-1 md:row-end-4",
  weapon: "md:col-start-7 md:col-end-14 md:row-start-4 md:row-end-7",
  echoes: "md:col-start-1 md:col-end-14 md:row-start-7 md:row-end-13",
} as const
