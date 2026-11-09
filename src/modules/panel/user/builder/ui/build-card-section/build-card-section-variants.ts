import { cva, type VariantProps } from "class-variance-authority"

/**
 * Shared presentation of a build card section.
 *
 * Use `fill` for sections that should stretch to their grid cell and
 * `interactive` for cards that open a dialog.
 */
export const buildCardSectionVariants = cva("", {
  variants: {
    fill: {
      true: "h-full w-full",
      false: "",
    },
    interactive: {
      true: "cursor-pointer",
      false: "",
    },
  },
  defaultVariants: {
    fill: true,
    interactive: false,
  },
})

export type BuildCardSectionVariants = VariantProps<
  typeof buildCardSectionVariants
>
