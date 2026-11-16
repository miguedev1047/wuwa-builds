import { Card } from "@/components/panelui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { CharacterDetail } from "@catalog/domain/character"

/** Read-only sequences for the selected resonator. */
export function SequencesContent({
  sequences,
  currentSequency,
}: {
  sequences: CharacterDetail["sequences"]
  currentSequency: number
}) {
  return (
    <div className="flex h-full items-center justify-between">
      {sequences.map((sequency) => (
        <HoverCard key={sequency.id}>
          <HoverCardTrigger
            render={
              <Image
                src={sequency.icon}
                alt={sequency.name + sequency.index}
                size="xs"
                data-active={sequency.index > currentSequency}
                background="glass"
                imgClassName="data-[active=true]:opacity-50 p-1"
              />
            }
          />
          <HoverCardContent className="w-150">
            <div className="space-y-4">
              <div className="flex min-w-0 items-start gap-3">
                <Show when={sequency.icon} fallback={sequency.index}>
                  {(icon) => <Image size="xs" src={icon} alt={sequency.name} />}
                </Show>
                <div className="flex min-w-0 flex-col gap-1">
                  <Card.Title className="truncate">{sequency.name}</Card.Title>
                  <Card.Description>
                    Secuencia {sequency.index}
                  </Card.Description>
                </div>
              </div>
              <div
                className="text-xs/relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sequency.description }}
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
