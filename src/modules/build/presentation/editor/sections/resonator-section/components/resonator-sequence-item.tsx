import { Badge } from "@/components/ui/badge"
import { Image } from "@/components/ui/image"
import { Separator } from "@/components/ui/separator"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Show } from "@/components/utility/show"
import { cn } from "cn"
import { cva } from "class-variance-authority"
import { ResonatorSequencePreview } from "@build/presentation/editor/sections/resonator-section/components/resonator-sequence-preview"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

const sequenceCardVariants = cva(
  "shrink-0 border p-2 shadow-brand-warning data-[active=true]:border-brand-warning! data-[active=true]:shadow-lg/20",
  {
    variants: {
      layout: {
        row: "",
        grid: "relative aspect-square overflow-visible!",
      },
    },
    defaultVariants: {
      layout: "row",
    },
  }
)

type ResonatorSequenceItemProps = {
  sequence: CharacterDetail["sequences"][number]
  /** Sequence layout of the current breakpoint. */
  layout: "row" | "grid"
  /** True when the build rank reaches this node. */
  isActive: boolean
  /** Draws the chain connector before the node; the row layout only. */
  showConnector?: boolean
  onToggle: (rank: number) => void
}

/** One sequence node with its hover preview. */
export function ResonatorSequenceItem({
  sequence,
  layout,
  isActive,
  showConnector = false,
  onToggle,
}: ResonatorSequenceItemProps) {
  const isGrid = layout === "grid"

  return (
    <HoverCard>
      <Show when={showConnector}>
        <Separator
          data-active={isActive}
          className="h-2 data-[active=true]:bg-brand-warning sm:w-2! md:w-4! xl:w-8!"
        />
      </Show>

      <HoverCardTrigger
        render={
          <BuildWorkspace.Card
            data-active={isActive}
            cardColor="input"
            onClick={() => onToggle(sequence.index)}
            role="button"
            className={sequenceCardVariants({ layout })}
          >
            <Image
              src={sequence.icon}
              alt={sequence.name}
              className={cn(isGrid ? "size-full" : "sm:size-8 md:size-10")}
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
