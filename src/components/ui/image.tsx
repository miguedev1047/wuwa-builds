import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const imageVariants = cva(
  "group relative block shrink-0 overflow-hidden bg-accent select-none",
  {
    variants: {
      aspect: {
        square: "aspect-square",
        portrait: "aspect-2/3",
      },
      size: {
        xs: "w-12",
        sm: "w-20",
        md: "w-32",
        lg: "w-48",
        xl: "w-64",
        full: "w-full",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      hover: {
        none: "",
        zoom: "[&_img]:transition-transform [&_img]:duration-300 [&_img]:ease-out group-hover:[&_img]:scale-105",
        lift: "transition-transform duration-300 hover:-translate-y-1",
        fade: "[&_img]:transition-opacity [&_img]:duration-300 hover:[&_img]:opacity-80",
      },
    },
    defaultVariants: {
      aspect: "square",
      size: "md",
      rounded: "lg",
      hover: "none",
    },
  }
)

const imageFitVariants = cva("size-full", {
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
    },
  },
  defaultVariants: {
    fit: "cover",
  },
})

export interface ImageProps
  extends
    Omit<React.ComponentProps<"img">, "className">,
    VariantProps<typeof imageVariants> {
  src: string
  alt: string
  /** Classes applied to the figure wrapper. */
  className?: string
  /** Classes applied to the image, after the fit variant. */
  imgClassName?: string
  fit?: VariantProps<typeof imageFitVariants>["fit"]
}

/**
 * Image with a fixed aspect ratio, lazy loading and an optional hover effect.
 *
 * The wrapper uses `aspect-square` or `aspect-2/3`, one of the preset sizes and
 * `group` so hover variants can target the image.
 */
export function Image({
  className,
  imgClassName,
  aspect,
  size,
  rounded,
  hover,
  fit,
  loading = "lazy",
  decoding = "async",
  ...props
}: ImageProps) {
  return (
    <figure
      className={cn(imageVariants({ aspect, size, rounded, hover }), className)}
    >
      <img
        {...props}
        loading={loading}
        decoding={decoding}
        className={cn(imageFitVariants({ fit }), imgClassName)}
      />
    </figure>
  )
}

export { imageVariants, imageFitVariants }
