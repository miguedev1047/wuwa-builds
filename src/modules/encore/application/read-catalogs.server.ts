import type { EncoreEchoDetail, EncoreEchoSummary } from "../domain/echo"
import { encoreAssetUrl } from "../domain/asset"
import type { EncoreWeaponDetail, EncoreWeaponSummary } from "../domain/weapon"
import { fetchEncoreJson } from "../infrastructure/http.server"
import {
  toEchoDetail,
  toEchoSummary,
  toWeaponDetail,
  toWeaponSummary,
  type RawEchoDetail,
  type RawEchoList,
  type RawWeaponDetail,
  type RawWeaponList,
} from "../infrastructure/mapper.server"

/** A sonata set resolved from one of the echoes that carries it. */
export interface EncoreSonataSet {
  id: number
  name: string
  icon: string
  color: string
  /** `pieces` is `FetterMap[].Key`: 1, 2, 3 or 5. */
  effects: { pieces: number; description: string }[]
}

export async function readWeapons(): Promise<EncoreWeaponSummary[]> {
  const data = await fetchEncoreJson<RawWeaponList>("weapon")
  return (data.weapons ?? []).map(toWeaponSummary)
}

export async function readWeapon(id: number): Promise<EncoreWeaponDetail> {
  const data = await fetchEncoreJson<RawWeaponDetail>(`weapon/${id}`)
  return toWeaponDetail(data)
}

export async function readEchoes(): Promise<EncoreEchoSummary[]> {
  const data = await fetchEncoreJson<RawEchoList>("echo")

  // `phantomsList` mixes echoes with cosmetic phantom skins and `Type` is the
  // only discriminator (`Eco` vs `Apariencia Fantasma` in `es`).
  return (data.phantomsList ?? [])
    .filter((raw) => raw.Type === "Eco")
    .map(toEchoSummary)
}

export async function readEcho(id: number): Promise<EncoreEchoDetail> {
  const data = await fetchEncoreJson<RawEchoDetail>(`echo/${id}`)
  return toEchoDetail(data)
}

/**
 * Reads every sonata set with the piece thresholds and resolved effects.
 *
 * The list endpoint cannot be used alone: it hides `FetterMap` and sends `{0}`
 * placeholders, so each set is resolved from the detail of the first echo that
 * carries it. That is one request per set, which the caller runs as a manual
 * admin sync, never per page view.
 */
export async function readSonataSets(): Promise<EncoreSonataSet[]> {
  const data = await fetchEncoreJson<RawEchoList>("echo")
  const echoes = (data.phantomsList ?? []).filter((raw) => raw.Type === "Eco")

  const carriers = new Map<
    number,
    { name: string; icon: string; echoId: number }
  >()

  for (const echo of echoes) {
    for (const group of echo.FetterGroups ?? []) {
      if (carriers.has(group.Id)) continue

      carriers.set(group.Id, {
        name: group.Name ?? "",
        icon: encoreAssetUrl(group.Icon),
        echoId: echo.Id,
      })
    }
  }

  const sets: EncoreSonataSet[] = []

  for (const [id, carrier] of [...carriers.entries()].sort(
    ([left], [right]) => left - right
  )) {
    const detail = await fetchEncoreJson<RawEchoDetail>(
      `echo/${carrier.echoId}`
    )
    const group = (detail.FetterGroupDetails ?? []).find(
      (entry) => entry.Group?.Id === id
    )
    const name = group?.Group?.FetterGroupName || carrier.name
    const descriptions = detail.FetterDetails?.[name]?.EffectDescriptions ?? []
    const thresholds = (group?.Group?.FetterMap ?? []).map((entry) => entry.Key)

    sets.push({
      id,
      name,
      icon: carrier.icon || encoreAssetUrl(group?.Group?.FetterElementPath),
      color: group?.Group?.FetterElementColor ?? "",
      effects: descriptions.map((description, index) => ({
        pieces: thresholds[index] ?? 2,
        description,
      })),
    })
  }

  return sets
}
