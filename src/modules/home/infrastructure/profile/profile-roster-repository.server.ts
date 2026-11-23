import type { AppDb } from "@db/create"
import { builds } from "@db/schemas/builds"
import { resonators } from "@db/schemas/resonators"
import { userProfiles } from "@db/schemas/user-profiles"
import { groupProfileBuilds } from "@home/application/profile/group-profile-builds"
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm"

function profileRosterVisibility(userId: string, viewerId?: string) {
  if (viewerId === userId) return undefined
  return and(eq(userProfiles.isPublic, true), eq(resonators.isVisible, true))
}

/** Reads roster summaries visible to the current visitor in one D1 query. */
export async function readProfileRosters(
  database: AppDb,
  userId: string,
  viewerId: string | undefined
) {
  const rows = await database
    .select({
      characterId: builds.characterId,
      characterName: resonators.name,
      characterIcon: resonators.icon,
      buildId: builds.id,
      buildName: builds.name,
      updatedAt: builds.updatedAt,
      level: sql<unknown>`case when json_valid(${builds.payload})
        then json_extract(${builds.payload}, '$.resonator.level') end`,
    })
    .from(builds)
    .leftJoin(resonators, eq(resonators.id, builds.characterId))
    .leftJoin(userProfiles, eq(userProfiles.userId, builds.userId))
    .where(
      and(
        eq(builds.userId, userId),
        isNotNull(builds.characterId),
        profileRosterVisibility(userId, viewerId)
      )
    )
    .orderBy(desc(builds.updatedAt), asc(builds.id))

  return groupProfileBuilds(rows)
}

/** Reads the saved documents in a single visible roster. */
export function readProfileRosterBuildRows(
  database: AppDb,
  userId: string,
  characterId: number,
  viewerId: string | undefined
) {
  return database
    .select({
      id: builds.id,
      userId: builds.userId,
      characterId: builds.characterId,
      name: builds.name,
      payload: sql<
        string | null
      >`case when json_valid(${builds.payload}) then ${builds.payload} end`,
      documentVersion: builds.documentVersion,
      createdAt: builds.createdAt,
      updatedAt: builds.updatedAt,
    })
    .from(builds)
    .leftJoin(resonators, eq(resonators.id, builds.characterId))
    .leftJoin(userProfiles, eq(userProfiles.userId, builds.userId))
    .where(
      and(
        eq(builds.userId, userId),
        eq(builds.characterId, characterId),
        profileRosterVisibility(userId, viewerId)
      )
    )
    .orderBy(desc(builds.updatedAt), asc(builds.id))
}
