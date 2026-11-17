import type { BuildProps } from "@build/domain/build-record"
import { ResonatorBuildSearch } from "@build/presentation/editor/searches/resonators"

type ResonatorActionsProps = {
  build: BuildProps
}

/** Actions of the resonator section: change the resonator or edit its skills. */
export function ResonatorActions({ build }: ResonatorActionsProps) {
  return <ResonatorBuildSearch build={build} />
}
