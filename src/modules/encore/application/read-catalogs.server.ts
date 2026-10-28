import type { EncoreEchoDetail, EncoreEchoSummary } from "../domain/echo"
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
  return (data.Echo ?? []).map(toEchoSummary)
}

export async function readEcho(id: number): Promise<EncoreEchoDetail> {
  const data = await fetchEncoreJson<RawEchoDetail>(`echo/${id}`)
  return toEchoDetail(data)
}
