/** A saved build summary shown in a profile roster. */
export type ProfileRosterBuild = {
  buildId: string
  name: string
  updatedAt: string
  level: number | null
}

/** The variants of one resonator belonging to the profile owner. */
export type ProfileRoster = {
  characterId: number
  name: string
  icon: string | null
  builds: ProfileRosterBuild[]
}
import type {
  BuildCanvasData,
  BuildCanvasPreview,
} from "@build/domain/build-canvas"

/** A visible build prepared for a read-only card. */
export type ProfileRosterCard = {
  buildId: string
  build: BuildCanvasData
  preview: BuildCanvasPreview
}
