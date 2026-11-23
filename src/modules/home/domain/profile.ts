/** The profile data a permitted visitor may see. */
export type ProfileView = {
  /** Whether the signed-in visitor owns this profile. */
  isYou: boolean
  /** Whether visitors can open this profile without a session. */
  isPublic: boolean
  name: string
  gameServer: string | null
  gameUid: string | null
  gameName: string | null
  photoUrl: string | null
  /** Stored avatar override, included only in the owner's view. */
  customPhotoUrl?: string | null
  thumbnailUrl: string | null
}
