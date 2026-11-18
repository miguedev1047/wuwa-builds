import { linkOptions } from "@tanstack/react-router"

export const buildLinkOptions = (buildId: string) =>
  linkOptions({
    to: "/panel/builder/$buildId",
    params: { buildId },
  })
