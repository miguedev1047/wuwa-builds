import { useSuspenseQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { echoQueries } from "@catalog/queries/echoes"
import { EchoDeleteAction } from "@catalog/presentation/echoes/detail/sections/info/components/echo-delete-action"
import { EchoEditAction } from "@catalog/presentation/echoes/detail/sections/info/components/echo-edit-action"
import {
  echoClassLabel,
  echoCostLabel,
} from "@catalog/presentation/echoes/shared/constants/echo"

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
          <EchoDeleteAction echoId={echoId} />
        </EditableSection.Action>
      </EditableSection.Header>

      <EditableSection.Content className="flex w-full flex-col items-start gap-4 md:flex-row">
        <Show when={echo.icon}>
          {(icon) => (
            <CatalogSection.Image
              src={icon}
              alt={echo.name}
              background="accent"
              size="md"
              aspect="square"
              className="object-contain"
            />
          )}
        </Show>

        <EditableSection.Body>
          <EditableSection.Heading>{echo.name}</EditableSection.Heading>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{echoClassLabel(echo.class)}</Badge>
            <Badge variant="outline">{echoCostLabel(echo.cost)}</Badge>
            <Badge variant="outline">ID {echo.id}</Badge>
          </div>
        </EditableSection.Body>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}
