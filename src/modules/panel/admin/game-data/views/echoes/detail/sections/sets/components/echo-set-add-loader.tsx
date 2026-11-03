import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreEchoQueries } from "@/modules/encore/queries/catalogs"
import { echoQueries } from "@/modules/panel/admin/game-data/queries/echoes"
import { EchoSetAddAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-set-add-action"

type EchoSetAddLoaderProps = {
  echoId: number
}

/**
 * Builds the picker from the sets Encore assigns to this echo, skipping the
 * ones already saved, so the form is prefilled with real options.
 */
export function EchoSetAddLoader({ echoId }: EchoSetAddLoaderProps) {
  const { data: encoreEcho } = useSuspenseQuery(
    encoreEchoQueries.detail(echoId)
  )
  const { data: echo } = useSuspenseQuery(echoQueries.detail(echoId))

  const saved = new Set(echo.sets.map((echoSet) => echoSet.setId))
  const options = encoreEcho.sets
    .filter((set) => !saved.has(set.id))
    .map((set) => ({ label: set.name, value: set.id }))

  return <EchoSetAddAction echoId={echoId} options={options} />
}
