import { cva, type VariantProps } from "class-variance-authority"

/**
 * Visual shell of the catalog pickers.
 *
 * Keep layout values here so each picker can be restyled without touching its
 * data or selection logic.
 */
export const buildCatalogPickerVariants = cva("grid w-full", {
  variants: {
    columns: {
      4: "grid-cols-2 gap-4 sm:grid-cols-4",
      6: "grid-cols-3 gap-3 sm:grid-cols-6",
      8: "grid-cols-4 gap-2 sm:grid-cols-8",
      10: "grid-cols-4 gap-2 sm:grid-cols-10",
    },
  },
  defaultVariants: {
    columns: 8,
  },
})

export type BuildCatalogPickerColumns = NonNullable<
  VariantProps<typeof buildCatalogPickerVariants>["columns"]
>

/** One selectable image inside a catalog picker. */
export const buildCatalogPickerItemVariants = cva(
  "group relative block w-full overflow-hidden rounded-xl transition-[translate,scale,opacity] duration-150 ease-out outline-none enabled:active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:enabled:active:scale-100",
  {
    variants: {
      selected: {
        true: "ring-2 ring-primary ring-offset-2 ring-offset-background",
        false: "",
      },
      hover: {
        true: "hover:-translate-y-0.5",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
      hover: true,
    },
  }
)
