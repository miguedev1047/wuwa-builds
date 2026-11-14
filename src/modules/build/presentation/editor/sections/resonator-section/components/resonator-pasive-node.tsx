import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ResonatorPassivesDataProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@/modules/build/presentation/editor/components/workspace"
import { Image } from "@/components/ui/image"

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
            data-active={node.enabled}
            role="button"
            cardColor="input"
            onClick={() => onToggle(!node.enabled)}
            className="relative shrink-0 border p-2 shadow-brand-warning data-[active=true]:border-brand-warning data-[active=true]:shadow-lg/20"
          >
            <Image
              src={node.icon}
              alt={node.name}
              className="size-full object-contain"
            />
          </BuildWorkspace.Card>
        }
      />
      <TooltipContent>{node.name}</TooltipContent>
    </Tooltip>
  )
}
