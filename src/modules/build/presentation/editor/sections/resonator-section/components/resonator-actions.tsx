import type { BuildProps } from "@build/domain/build-record"
import { useSelectResonator } from "@build/presentation/editor/hooks/use-select-resonator"
import { ResonatorBuildSearch } from "@build/presentation/editor/searches/resonators"

type ResonatorActionsProps = {
  build: BuildProps
}

/** Binds the resonator picker to the current build. */
export function ResonatorActions({ build }: ResonatorActionsProps) {
  const { selectResonator } = useSelectResonator()

  return (
    <ResonatorBuildSearch
      selectedResonatorId={build.resonator.data?.id}
      onSelect={async (resonator) => {
        const result = await selectResonator(resonator)
        return result === "selected" || result === "unchanged"
      }}
    />
  )
}
