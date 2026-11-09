import { BuildCard } from "../build-card"

/** Card that hosts one section of the build card. */
export function BuildCardSection({
  ...props
}: React.ComponentProps<typeof BuildCard>) {
  return <BuildCard data-slot="build-card-section" {...props} />
}
