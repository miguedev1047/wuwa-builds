import type { SonataSetEffectRow, SonataSetRow } from "@/db/schema"

/** Sonata set with its piece thresholds. */
export type SonataCatalogEntry = SonataSetRow & {
  effects: SonataSetEffectRow[]
}
