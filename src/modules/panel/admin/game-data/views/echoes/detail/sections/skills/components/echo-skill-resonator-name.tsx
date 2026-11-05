import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"

type EchoSkillResonatorNameProps = {
  /** Character id stored in `condition_value`. */
  value: string
}

/** Suspended name of the resonador a bonus is tied to. */
export function EchoSkillResonatorName({ value }: EchoSkillResonatorNameProps) {
  const { data: characters } = useSuspenseQuery(encoreCharacterQueries.list())
  const id = Number(value)

  return (
    <>
      {characters.find((character) => character.id === id)?.name ?? `#${value}`}
    </>
  )
}
