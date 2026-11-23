import { CHARACTER_LEVEL_MAX, CHARACTER_LEVEL_MIN } from "@build/domain/build"
import type { ProfileRoster } from "@home/domain/profile-roster"

export type ProfileBuildRow = {
  characterId: number | null
  characterName: string | null
  characterIcon: string | null
  buildId: string
  buildName: string
  updatedAt: Date
  level: unknown
}

/** Groups rows already sorted by descending update time and ascending build ID. */
export function groupProfileBuilds(
  rows: readonly ProfileBuildRow[]
): ProfileRoster[] {
  const rosters = new Map<number, ProfileRoster>()

  for (const row of rows) {
    if (row.characterId === null) continue

    let roster = rosters.get(row.characterId)
    if (!roster) {
      roster = {
        characterId: row.characterId,
        name: row.characterName ?? "Resonador desconocido",
        icon: row.characterIcon,
        builds: [],
      }
      rosters.set(row.characterId, roster)
    }

    const { level } = row
    const validLevel =
      typeof level === "number" &&
      Number.isInteger(level) &&
      level >= CHARACTER_LEVEL_MIN &&
      level <= CHARACTER_LEVEL_MAX

    roster.builds.push({
      buildId: row.buildId,
      name: row.buildName,
      updatedAt: row.updatedAt.toISOString(),
      level: validLevel ? level : null,
    })
  }

  return [...rosters.values()]
}
