import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import type { EchoSetRow, SonataSetEffectRow } from "@db/schema"
import { EditableSection } from "@catalog/presentation/components/editable-section"

type SonataCardProps = {
  echoSet: EchoSetRow & {
    sonataEffects: SonataSetEffectRow[]
  }
}

export function SonataCardContent({ echoSet }: SonataCardProps) {
  return (
    <EditableSection.Card>
      <EditableSection.CardHeader>
        <div className="flex items-center gap-2">
          <Show when={echoSet.icon}>
            {(icon) => (
              <EditableSection.ItemMedia className="size-10 rounded-md">
                <EditableSection.Image
                  src={icon}
                  alt={echoSet.name}
                  className="object-contain p-1"
                />
              </EditableSection.ItemMedia>
            )}
          </Show>
          <div>
            <EditableSection.CardTitle>
              {echoSet.name}
            </EditableSection.CardTitle>
            <div className="flex flex-wrap items-center gap-1">
              {echoSet.sonataEffects.map((effect) => (
                <Badge key={effect.id} variant="secondary">
                  {effect.pieces} {effect.pieces === 1 ? "pieza" : "piezas"}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </EditableSection.CardHeader>

      <EditableSection.CardContent>
        <EditableSection.CardDescription className="space-y-1">
          {echoSet.sonataEffects.map((effect) => (
            <span key={effect.id} className="block">
              <span className="font-medium text-foreground">
                {effect.pieces}p:
              </span>{" "}
              {effect.description}
            </span>
          ))}
        </EditableSection.CardDescription>
      </EditableSection.CardContent>
    </EditableSection.Card>
  )
}
