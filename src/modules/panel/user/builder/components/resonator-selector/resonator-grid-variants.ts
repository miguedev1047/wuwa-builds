import { cva, type VariantProps } from "class-variance-authority"

export const resonatorGridVariants = cva("grid w-full", {
  variants: {
    columns: {
      4: "grid-cols-2 gap-4 sm:grid-cols-4",
      6: "grid-cols-3 gap-3 sm:grid-cols-6",
      8: "grid-cols-4 gap-2 sm:grid-cols-8",
    },
  },
  defaultVariants: {
    columns: 8,
  },
})

export type ResonatorGridColumns = NonNullable<
  VariantProps<typeof resonatorGridVariants>["columns"]
>
