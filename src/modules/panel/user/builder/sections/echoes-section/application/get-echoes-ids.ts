import type { EchoesDataProps } from "@/modules/builds/domain/build-record"

export function getEchoesIds(echoes: EchoesDataProps[]) {
  const echoIds = [
    ...new Set(echoes.flatMap((echo) => (echo.data ? [echo.data.id] : []))),
  ]

  return echoIds
}
