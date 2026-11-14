import { Image } from "@/components/ui/image"
import { cn } from "cn"
import type { VariantProps } from "class-variance-authority"
import { aspectVariants } from "@catalog/presentation/components/catalog-section/components/catalog-section-list"
type CatalogSectionItemProps = React.ComponentProps<"li"> &
  VariantProps<typeof aspectVariants>

export function CatalogSectionItem({
  className,
  aspect,
  ...props
}: CatalogSectionItemProps) {
  return (
    <li
      data-slot="catalog-section-item"
      role="button"
      className={cn(
        "overflow-hidden bg-accent",
        aspectVariants({ aspect }),
        className
      )}
      {...props}
    />
  )
}

type CatalogSectionImage = React.ComponentProps<typeof Image>

export function CatalogSectionImage({
  className,
  ...props
}: CatalogSectionImage) {
  return (
    <Image
      data-slot="catalog-section-image"
      className={cn(className)}
      {...props}
    />
  )
}
