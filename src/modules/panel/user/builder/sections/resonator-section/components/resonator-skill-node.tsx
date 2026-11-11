import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"
import { cva } from "class-variance-authority"

const skillNodeVariants = cva(
  "bg-accen grid size-9 shrink-0 place-items-center border p-2 transition-colors duration-150 outline-none select-none sm:size-10 sm:p-2.5 md:size-12 md:p-3",
  {
    variants: {
      kind: {
        passive: "rounded-full",
        skill: "rounded-xl",
      },
      enabled: {
        true: "",
        false: "opacity-40 grayscale",
      },
    },
    compoundVariants: [
      {
        kind: "passive",
        enabled: true,
        className: "border-brand-warning shadow-lg shadow-brand-warning/20",
      },
      { kind: "passive", enabled: false, className: "border-border" },
      {
        kind: "skill",
        enabled: true,
        className: "border-brand-info shadow-lg shadow-brand-info/20",
      },
      { kind: "skill", enabled: false, className: "border-brand-info/20" },
    ],
    defaultVariants: {
      kind: "passive",
      enabled: true,
    },
  }
)

type ResonatorSkillNodeProps = {
  node: ResonatorPassivesDataProps
  onToggle: (enabled: boolean) => void
}

/**
 * One node of the resonator forte tree.
 *
 * Passive nodes read as a round, warm-ringed socket; the `skill` nodes that
 * share the circuit column are square and cool-tinted, so the tree keeps the
 * two node kinds apart without a legend. Clicking a node toggles its effect.
 */
export function ResonatorSkillNode({
  node,
  onToggle,
}: ResonatorSkillNodeProps) {
  const kind = node.type === "skill" ? "skill" : "passive"

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            role="switch"
            aria-checked={node.enabled}
            aria-label={node.name}
            onClick={() => onToggle(!node.enabled)}
            className={skillNodeVariants({ kind, enabled: node.enabled })}
          >
            <img src={node.icon} alt="" className="size-full object-contain" />
          </button>
        }
      />

      <TooltipContent>{node.name}</TooltipContent>
    </Tooltip>
  )
}
