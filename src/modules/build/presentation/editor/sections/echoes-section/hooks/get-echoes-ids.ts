import type { EchoesDataProps } from "@build/domain/build-record"

export function getEchoesIds(echoes: EchoesDataProps[]) {
  const echoIds = [
    ...new Set(echoes.flatMap((echo) => (echo.data ? [echo.data.id] : []))),
  ]

  return echoIds
}
