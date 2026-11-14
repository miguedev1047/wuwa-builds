import { buildEdits } from "@build/application/build-edits"
import { updateBuild, type LocalBuildIdentity } from "@build/client/build-store"
import type {
  CharacterDetail,
  CharacterSummary,
} from "@catalog/domain/character"

const pendingSelections = new Map<string, symbol>()

/** Resolve and apply the latest resonator selection for this local build. */
export async function selectLocalResonator(
  identity: LocalBuildIdentity,
  character: CharacterSummary,
  loadDetail: () => Promise<CharacterDetail>
): Promise<"selected" | "unchanged" | "discarded"> {
  const key = JSON.stringify([identity.sessionId, identity.buildId])
  const selection = Symbol()
  pendingSelections.set(key, selection)

  try {
    const detail = await loadDetail()
    if (pendingSelections.get(key) !== selection) return "discarded"

    let selected = false
    const updated = updateBuild(identity, (draft) => {
      selected = buildEdits.selectResonator(draft, character, detail)
    })

    if (!updated) return "discarded"
    return selected ? "selected" : "unchanged"
  } catch (error) {
    if (pendingSelections.get(key) !== selection) return "discarded"
    throw error
  } finally {
    if (pendingSelections.get(key) === selection) pendingSelections.delete(key)
  }
}
