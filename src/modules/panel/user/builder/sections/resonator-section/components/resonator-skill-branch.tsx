import { Show } from "@/components/utility/show"
import type {
  ResonatorPassivesDataProps,
  ResonatorSkillsDataProps,
} from "@builds/domain/build-record"
import { ResonatorSkillItem } from "@builder/sections/resonator-section/components/resonator-skill-item"
import { ResonatorSkillNode } from "@builder/sections/resonator-section/components/resonator-skill-node"
import type { ResonatorSkillRow } from "@db/schema"
import { cn } from "cn"
import { cva, type VariantProps } from "class-variance-authority"

/**
 * Vertical offset of a branch.
 *
 * The offsets never change the flow of the grid: only the painted column moves,
 * so the five branches keep one row height and the connectors stay chained.
 */
const branchVariants = cva("flex flex-col items-center", {
  variants: {
    lift: {
      none: "",
      down: "translate-y-4",
      up: "-translate-y-2",
      top: "-translate-y-4",
    },
  },
  defaultVariants: {
    lift: "none",
  },
})

type ResonatorSkillBranchProps = {
  /** Upper node of the branch. */
  top?: ResonatorPassivesDataProps
  /** Lower node, the one chained to the skill below. */
  bottom?: ResonatorPassivesDataProps
  /** Place of the column inside the arch of the tree. */
  lift?: VariantProps<typeof branchVariants>["lift"]
  skill?: ResonatorSkillsDataProps
  catalogSkill?: Pick<ResonatorSkillRow, "name" | "type" | "icon">
  onPassiveToggle: (id: number, enabled: boolean) => void
  onSkillStep: (skillId: number, delta: number) => void
}

/**
 * One column of the forte tree: two chained nodes and the skill underneath.
 *
 * The connector tint follows the node above it, so an active branch reads as a
 * lit path from the first socket down to its level control.
 */
export function ResonatorSkillBranch({
  top,
  bottom,
  lift,
  skill,
  catalogSkill,
  onPassiveToggle,
  onSkillStep,
}: ResonatorSkillBranchProps) {
  return (
    <li className={branchVariants({ lift })}>
      <Show when={top}>
        {(node) => (
          <ResonatorSkillNode
            node={node}
            onToggle={(enabled) => onPassiveToggle(node.id, enabled)}
          />
        )}
      </Show>

      <span
        aria-hidden
        className={cn(
          "h-4 w-px bg-border sm:h-6 md:h-8",
          top?.enabled && connectorTone(top.type)
        )}
      />

      <Show when={bottom}>
        {(node) => (
          <ResonatorSkillNode
            node={node}
            onToggle={(enabled) => onPassiveToggle(node.id, enabled)}
          />
        )}
      </Show>

      <Show when={skill && catalogSkill}>
        <span
          aria-hidden
          className={cn(
            "mb-2 h-4 w-px bg-border sm:h-6 md:h-8",
            bottom?.enabled && connectorTone(bottom.type)
          )}
        />
      </Show>

      <Show when={catalogSkill}>
        {(catalog) => (
          <Show when={skill}>
            {(buildSkill) => (
              <ResonatorSkillItem
                skill={buildSkill}
                catalogSkill={catalog}
                onStep={(delta) => onSkillStep(buildSkill.skillId, delta)}
              />
            )}
          </Show>
        )}
      </Show>
    </li>
  )
}

function connectorTone(type: ResonatorPassivesDataProps["type"]) {
  return type === "skill" ? "bg-brand-info" : "bg-brand-warning"
}
