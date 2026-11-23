import { SERVERS } from "@home/constants/profile"
import { z } from "zod"

const serverIds = new Set(SERVERS.map(({ value }) => value))

const profileImageUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (value === "") return true

    const url = URL.parse(value)
    if (
      !url ||
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !/\.(?:jpe?g|png|webp|gif|avif)$/i.test(url.pathname)
    )
      return false

    const host = url.hostname
    return (
      host === "i.pinimg.com" ||
      host === "alphacoders.com" ||
      host.endsWith(".alphacoders.com") ||
      host === "w.wallhaven.cc" ||
      host === "th.wallhaven.cc"
    )
  }, "Usa un enlace directo HTTPS a una imagen de Pinterest, Alpha Coders o Wallhaven.")

export const profileUpdateInput = z.strictObject({
  isPublic: z.boolean(),
  gameName: z.string().trim(),
  gameUid: z
    .string()
    .trim()
    .regex(/^\d*$/, "El UID solo puede contener dígitos."),
  gameServer: z
    .string()
    .refine(
      (value) => value === "" || serverIds.has(value),
      "Elige un servidor de la lista."
    ),
  photoUrl: profileImageUrl,
  thumbnailUrl: profileImageUrl,
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateInput>
