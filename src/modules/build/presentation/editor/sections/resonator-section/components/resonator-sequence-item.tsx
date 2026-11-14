import { Badge } from "@/components/ui/badge"
import { Image } from "@/components/ui/image"
import { Separator } from "@/components/ui/separator"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Show } from "@/components/utility/show"
import { ResonatorSequencePreview } from "@build/presentation/editor/sections/resonator-section/components/resonator-sequence-preview"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

type ResonatorSequenceItemProps = {
  sequence: CharacterDetail["sequences"][number]
  /** Sequence layout of the current breakpoint. */
  layout: "row" | "grid"
  /** True when the build rank reaches this node. */
  isActive: boolean
  onToggle: (rank: number) => void
}

/** One sequence node with its hover preview. */
export function ResonatorSequenceItem({
  sequence,
  layout,
  isActive,
  onToggle,
}: ResonatorSequenceItemProps) {
  const isGrid = layout === "grid"

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <BuildWorkspace.Card
            data-active={isActive}
            cardColor="input"
            role="button"
            onClick={() => onToggle(sequence.index)}
            className="relative aspect-square shrink-0 border p-2 shadow-brand-warning data-[active=true]:border-brand-warning data-[active=true]:shadow-lg/20"
          >
            <Image
              src={sequence.icon}
              alt={sequence.name}
              className="size-full object-contain"
            />
            <Show when={isGrid}>
              <Badge className="absolute -top-2 -left-2 z-20 size-5 scale-80">
                {sequence.index}
              </Badge>
            </Show>
          </BuildWorkspace.Card>
        }
      />

      <HoverCardContent className="w-120">
        <ResonatorSequencePreview sequence={sequence} />
      </HoverCardContent>
    </HoverCard>
  )
}
