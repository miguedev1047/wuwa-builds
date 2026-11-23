import { db } from "@/db"
import { user, userProfiles } from "@db/schema"
import type { ProfileUpdateInput } from "@home/application/profile/profile-update"
import type { ProfileView } from "@home/domain/profile"
import { eq, sql } from "drizzle-orm"

/** Finds a profile by account ID and returns only the fields visible to the caller. */
export async function readProfile(
  userId: string,
  viewerId?: string
): Promise<ProfileView | null> {
  const [profile] = await db
    .select({
      ownerId: user.id,
      isPublic: userProfiles.isPublic,
      name: user.name,
      gameServer: userProfiles.gameServer,
      gameUid: userProfiles.gameUid,
      gameName: userProfiles.gameName,
      customPhotoUrl: userProfiles.photoUrl,
      photoUrl: sql<
        string | null
      >`coalesce(${userProfiles.photoUrl}, ${user.image})`,
      thumbnailUrl: userProfiles.thumbnailUrl,
    })
    .from(user)
    .leftJoin(userProfiles, eq(userProfiles.userId, user.id))
    .where(eq(user.id, userId))
    .limit(1)

  if (!profile) return null

  const isYou = profile.ownerId === viewerId
  if (!profile.isPublic && !isYou) return null

  return {
    isYou,
    isPublic: profile.isPublic ?? false,
    name: profile.name,
    gameServer: profile.gameServer,
    gameUid: profile.gameUid,
    gameName: profile.gameName,
    photoUrl: profile.photoUrl,
    ...(isYou && { customPhotoUrl: profile.customPhotoUrl }),
    thumbnailUrl: profile.thumbnailUrl,
  }
}

/** Upserts editable settings and visibility for the profile owner. */
export async function saveProfile(userId: string, data: ProfileUpdateInput) {
  const settings = {
    isPublic: data.isPublic,
    gameName: data.gameName || null,
    gameUid: data.gameUid || null,
    gameServer: data.gameServer || null,
    photoUrl: data.photoUrl || null,
    thumbnailUrl: data.thumbnailUrl || null,
  }

  await db
    .insert(userProfiles)
    .values({ userId, ...settings })
    .onConflictDoUpdate({ target: userProfiles.userId, set: settings })
}
