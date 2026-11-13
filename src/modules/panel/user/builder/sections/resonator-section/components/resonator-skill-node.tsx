import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"
import { BuildWorkspace } from "../../../components/workspace"

type ResonatorSkillNodeProps = {
  node: ResonatorPassivesDataProps
  onToggle: (enabled: boolean) => void
}

/**
 * One passive node of the skills dialog.
 *
 * Clicking it toggles the passive; the unchecked state dims and grays the card.
 */
export function ResonatorSkillNode({
  node,
  onToggle,
}: ResonatorSkillNodeProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <BuildWorkspace.Card
            role="switch"
            cardColor="input"
            data-checked={node.enabled}
            aria-label={node.name}
            onClick={() => onToggle(!node.enabled)}
            className="aspect-square data-[checked=false]:opacity-50 data-[checked=false]:grayscale"
          >
            <img
              src={node.icon}
              alt={node.name}
              className="pointer-events-none size-full object-contain select-none"
            />
          </BuildWorkspace.Card>
        }
      />

      <TooltipContent>{node.name}</TooltipContent>
    </Tooltip>
  )
}
