import {
  profileUpdateInput,
  type ProfileUpdateInput,
} from "@home/application/profile/profile-update"
import { SERVERS } from "@home/constants/profile"

export const profileServerOptions = [
  { value: "", label: "Sin servidor" },
  ...SERVERS,
]

export const profileFieldSchemas = profileUpdateInput.shape

export const profileFormDefaults: ProfileUpdateInput = {
  isPublic: false,
  gameName: "",
  gameUid: "",
  gameServer: "",
  photoUrl: "",
  thumbnailUrl: "",
}

export const profileImageFields = [
  {
    name: "photoUrl",
    label: "URL de la foto de perfil",
    title: "Vista previa",
  },
  {
    name: "thumbnailUrl",
    label: "URL de la portada",
    title: "Vista previa",
  },
] as const
