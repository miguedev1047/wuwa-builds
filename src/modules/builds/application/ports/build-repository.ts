import type { BuildPayload } from "../../domain/build"

export interface BuildRecord {
  id: string
  userId: string
  /** Numeric Encore character ID. */
  characterId: number
  name: string
  payload: BuildPayload
  documentVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateBuildData {
  characterId: number
  name: string
  payload: BuildPayload
}

export interface UpdateBuildData {
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
