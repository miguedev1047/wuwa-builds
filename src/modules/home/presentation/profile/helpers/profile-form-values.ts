import type { ProfileUpdateInput } from "@home/application/profile/profile-update"
import type { ProfileView } from "@home/domain/profile"
import { profileFieldSchemas } from "@home/presentation/profile/constants/profile-form-fields"

/** Converts saved profile settings into editable form values. */
export function getProfileFormValues(profile: ProfileView): ProfileUpdateInput {
  return {
    isPublic: profile.isPublic,
    gameName: profile.gameName ?? "",
    gameUid: profile.gameUid ?? "",
    gameServer: profile.gameServer ?? "",
    photoUrl: profile.customPhotoUrl ?? "",
    thumbnailUrl: profile.thumbnailUrl ?? "",
  }
}

/** Returns an accepted image URL, or null when there is nothing to preview. */
export function getProfileImagePreviewUrl(value: string): string | null {
  const result = profileFieldSchemas.photoUrl.safeParse(value)
  return result.success ? result.data || null : null
}
