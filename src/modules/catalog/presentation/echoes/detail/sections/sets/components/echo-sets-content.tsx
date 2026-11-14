import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { echoQueries } from "@catalog/queries/echoes"
import { EchoSetCard } from "@catalog/presentation/echoes/detail/sections/sets/components/echo-set-card"

type EchoSetsContentProps = {
  echoId: number
}

/** Suspended list of the sonata sets saved for the echo. */
export function EchoSetsContent({ echoId }: EchoSetsContentProps) {
  const { data: echo } = useSuspenseQuery(echoQueries.detail(echoId))

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={echo.sets}
        getItemKey={(echoSet) => echoSet.id}
        empty={
          <EditableSection.Text>
            Este eco todavía no tiene sets guardados.
          </EditableSection.Text>
        }
      >
        {(echoSet) => <EchoSetCard echoId={echoId} echoSet={echoSet} />}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
