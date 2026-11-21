import type { BuildPayload } from "@build/domain/build"

export interface BuildRecord {
  id: string
  userId: string
  /** Numeric Encore character ID; null while the build has no resonator. */
  characterId: number | null
  name: string
  payload: BuildPayload
  documentVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateBuildData {
  /** Client-owned id so offline and retried creations stay idempotent. */
  buildId: string
  characterId: number | null
  name: string
  payload: BuildPayload
}

export interface UpdateBuildData {
  characterId?: number | null
  name?: string
  payload?: BuildPayload
}

/**
 * Application-owned persistence contract. The D1/Drizzle adapter is one
 * implementation; the use cases never import Drizzle directly.
 */
export interface BuildRepository {
  listByUser(userId: string): Promise<BuildRecord[]>
  listByUserAndCharacter(
    userId: string,
    characterId: number
  ): Promise<BuildRecord[]>
  getById(userId: string, buildId: string): Promise<BuildRecord | null>
  create(userId: string, data: CreateBuildData): Promise<BuildRecord>
  update(
    userId: string,
    buildId: string,
    data: UpdateBuildData
  ): Promise<BuildRecord | null>
  delete(userId: string, buildId: string): Promise<boolean>
  deleteByCharacter(userId: string, characterId: number): Promise<number>
}
