import { SERVERS } from "@home/constants/profile"
import type { ProfileView } from "@home/domain/profile"

/** Formats the in-game details supplied by the profile owner. */
export function getProfileGameDetails(profile: ProfileView) {
  return [
    { label: "Nombre en el juego", value: profile.gameName },
    { label: "UID", value: profile.gameUid },
    {
      label: "Servidor",
      value: SERVERS.find(({ value }) => value === profile.gameServer)?.label,
    },
  ].filter(({ value }) => Boolean(value))
}
