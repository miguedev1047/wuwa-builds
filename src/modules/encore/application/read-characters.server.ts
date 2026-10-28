import type {
  EncoreCharacterDetail,
  EncoreCharacterSummary,
} from "../domain/character"
import { fetchEncoreJson } from "../infrastructure/http.server"
import {
  toCharacterDetail,
  toCharacterSummary,
  type RawCharacterDetail,
  type RawCharacterList,
} from "../infrastructure/mapper.server"

/** Character roster with only the fields needed by lists and pickers. */
export async function readCharacters(): Promise<EncoreCharacterSummary[]> {
  const data = await fetchEncoreJson<RawCharacterList>("character?page=1")
  return (data.roleList ?? []).map(toCharacterSummary)
}

/** Lean character detail (lore-only fields are dropped by the mapper). */
export async function readCharacter(
  id: number
): Promise<EncoreCharacterDetail> {
  const data = await fetchEncoreJson<RawCharacterDetail>(`character/${id}`)
  return toCharacterDetail(data)
}
