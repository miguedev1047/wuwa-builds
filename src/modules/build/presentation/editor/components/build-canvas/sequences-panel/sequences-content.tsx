import type { CharacterDetail } from "@catalog/domain/character"
import { Show } from "@/components/utility/show"
import { Image } from "@/components/ui/image"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CardDescription, CardTitle } from "@/components/ui/card"

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
                  <CardTitle className="truncate">{sequency.name}</CardTitle>
                  <CardDescription>Secuencia {sequency.index}</CardDescription>
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
