import type { BuildPayload } from "../../domain/build"

export interface BuildRecord {
  id: string
  userId: string
  resonatorSlug: string
  name: string
  payload: BuildPayload
  documentVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateBuildData {
  resonatorSlug: string
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
  listByUserAndResonator(
    userId: string,
    resonatorSlug: string
  ): Promise<BuildRecord[]>
  getById(userId: string, buildId: string): Promise<BuildRecord | null>
  create(userId: string, data: CreateBuildData): Promise<BuildRecord>
  update(
    userId: string,
    buildId: string,
    data: UpdateBuildData
  ): Promise<BuildRecord | null>
  delete(userId: string, buildId: string): Promise<boolean>
  deleteByResonator(userId: string, resonatorSlug: string): Promise<number>
}
