import { cn } from "cn"
import { BuildCard } from "../build-card"
import {
  buildCardSectionVariants,
  type BuildCardSectionVariants,
} from "./build-card-section-variants"

type BuildCardSectionProps = React.ComponentProps<typeof BuildCard> &
  BuildCardSectionVariants

/**
 * Card that hosts one section of the build card.
 *
 * The shared classes live in the variants file so padding, fill and hover can
 * change without editing every section.
 */
export function BuildCardSection({
  className,
  fill,
  interactive,
  hovered,
  ...props
}: BuildCardSectionProps) {
  return (
    <BuildCard
      data-slot="build-card-section"
      hovered={interactive || hovered}
      className={cn(buildCardSectionVariants({ fill, interactive }), className)}
      {...props}
    />
  )
}
