import type { EchoSelectionSummary } from "@catalog/domain/echo"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"
import type { SonataSetEffectRow } from "@db/schema"

/** One group of the echo list: a sonata set and the echoes that grant it. */
export interface EchoSonataGroup {
  /** The sonata set id, or `null` for echoes without a set. */
  setId: number | null
  name: string
  icon: string
  color: string
  effects: SonataSetEffectRow[]
  echoes: EchoSelectionSummary[]
}

const WITHOUT_SONATA = "Sin sonata"

/**
 * Groups the echoes by the sonata set they can drop from.
 *
 * An echo can belong to several sets, so it appears once in every group it
 * grants; the groups follow the catalog order and the echoes follow the order
 * they were read in. Sets the catalog does not know about fall back to the name
 * stored on the echo, and echoes without a set go last under "Sin sonata".
 */
export function groupEchoesBySonata(
  echoes: readonly EchoSelectionSummary[],
  sonatas: readonly SonataCatalogEntry[]
): EchoSonataGroup[] {
  const bySet = new Map<number, EchoSelectionSummary[]>()
  const withoutSet: EchoSelectionSummary[] = []

  for (const echo of echoes) {
    const sets = echo.sets.filter((set) => set.setId > 0)

    if (sets.length === 0) {
      withoutSet.push(echo)
      continue
    }

    for (const set of sets) {
      const group = bySet.get(set.setId)

      if (group) {
        group.push(echo)
        continue
      }

      bySet.set(set.setId, [echo])
    }
  }

  const groups: EchoSonataGroup[] = []

  for (const sonata of sonatas) {
    const grouped = bySet.get(sonata.id)

    if (!grouped?.length) continue

    bySet.delete(sonata.id)
    groups.push({
      setId: sonata.id,
      name: sonata.name,
      icon: sonata.icon,
      color: sonata.color,
      effects: sonata.effects,
      echoes: grouped,
    })
  }

  for (const [setId, grouped] of bySet) {
    const meta = echoes
      .flatMap((echo) => echo.sets)
      .find((set) => set.setId === setId)

    groups.push({
      setId,
      name: meta?.name || `Set ${setId}`,
      icon: meta?.icon ?? "",
      color: "",
      effects: [],
      echoes: grouped,
    })
  }

  if (withoutSet.length > 0) {
    groups.push({
      setId: null,
      name: WITHOUT_SONATA,
      icon: "",
      color: "",
      effects: [],
      echoes: withoutSet,
    })
  }

  return groups
}
