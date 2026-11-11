import { cn } from "cn"
import { Card } from "@/components/ui/card"

type BuildCardSectionProps = React.ComponentProps<typeof Card>

/**
 * Card that hosts one section of the build card.
 *
 * The shared classes live in the variants file so padding, fill and hover can
 * change without editing every section.
 */
export function BuildCardSection({
  className,
  ...props
}: BuildCardSectionProps) {
  return (
    <Card
      data-slot="build-card-section"
      className={cn("p-2 md:p-4", className)}
      {...props}
    />
  )
}
