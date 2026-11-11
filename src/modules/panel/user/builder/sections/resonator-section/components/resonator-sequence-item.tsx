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
import { BuildCard } from "@builder/ui/build-card"
import { ResonatorSequencePreview } from "@builder/sections/resonator-section/components/resonator-sequence-preview"
import type { CharacterDetail } from "@game-data/domain/character"

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
          <BuildCard
            data-active={isActive}
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
              <Badge className="absolute -top-1 -left-1 z-20 size-5">
                {sequence.index}
              </Badge>
            </Show>
          </BuildCard>
        }
      />

      <HoverCardContent className="w-120">
        <ResonatorSequencePreview sequence={sequence} />
      </HoverCardContent>
    </HoverCard>
  )
}
