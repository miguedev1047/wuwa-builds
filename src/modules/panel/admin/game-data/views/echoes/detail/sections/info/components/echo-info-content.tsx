import { useSuspenseQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { echoQueries } from "@/modules/panel/admin/game-data/queries/echoes"
import { EchoDeleteAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/info/components/echo-delete-action"
import { EchoEditAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/info/components/echo-edit-action"
import {
  echoClassLabel,
  echoCostLabel,
} from "@/modules/panel/admin/game-data/views/echoes/shared/constants/echo"

type EchoInfoContentProps = {
  echoId: number
}

/** Suspended summary block of the echo. */
export function EchoInfoContent({ echoId }: EchoInfoContentProps) {
  const { data: echo } = useSuspenseQuery(echoQueries.detail(echoId))

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Eco: {echo.name}</EditableSection.Title>

        <EditableSection.Description>
          Información básica del eco y sus datos de catálogo.
        </EditableSection.Description>

        <EditableSection.Action>
          <EchoEditAction echo={echo} />
          <EchoDeleteAction />
        </EditableSection.Action>
      </EditableSection.Header>

      <EditableSection.Content className="flex w-full flex-col items-start gap-4 md:flex-row">
        <Show when={echo.icon}>
          {(icon) => (
            <EditableSection.Media className="aspect-square w-32 bg-muted/40">
              <CatalogSection.Image
                src={icon}
                alt={echo.name}
                className="size-full object-contain"
              />
            </EditableSection.Media>
          )}
        </Show>

        <EditableSection.Body>
          <EditableSection.Heading>{echo.name}</EditableSection.Heading>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{echoClassLabel(echo.class)}</Badge>
            <Badge variant="outline">{echoCostLabel(echo.cost)}</Badge>
            <Badge variant="ghost">ID {echo.id}</Badge>
          </div>
        </EditableSection.Body>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}
