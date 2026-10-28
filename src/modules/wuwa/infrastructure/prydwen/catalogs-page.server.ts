import type { Echo, EchoSet, Weapon } from "../../domain/resonator"
import { extractArray, readFlight } from "./flight.server"

/**
 * Catalog pages differ from character pages: they ship the whole list as a
 * single array inside the RSC payload, so there is one request per catalog and
 * no detail pages.
 */
export function readWeaponsPage(html: string): Weapon[] {
  const weapons = extractArray<Weapon>(readFlight(html), "weapons")
  if (!weapons || weapons.length === 0) {
    throw new Error("Weapon catalog not found in the weapons page")
  }
  return weapons
}

export interface EchoesPageData {
  echoes: Echo[]
  echoSets: EchoSet[]
}

export function readEchoesPage(html: string): EchoesPageData {
  const flight = readFlight(html)
  const echoes = extractArray<Echo>(flight, "echoes")
  const echoSets = extractArray<EchoSet>(flight, "echoSets")

  if (!echoes || echoes.length === 0) {
    throw new Error("Echo catalog not found in the echoes page")
  }
  if (!echoSets || echoSets.length === 0) {
    throw new Error("Echo set catalog not found in the echoes page")
  }

  return { echoes, echoSets }
}
