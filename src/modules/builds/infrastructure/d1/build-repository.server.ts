import { and, desc, eq } from "drizzle-orm"
import { db, type AppDb } from "@/db"
import { builds, type BuildRow } from "@/db/schemas/builds"
import type {
  BuildRecord,
  BuildRepository,
  CreateBuildData,
  UpdateBuildData,
} from "../../application/ports/build-repository"
import { BUILD_DOCUMENT_VERSION } from "../../domain/build"

function toRecord(row: BuildRow): BuildRecord {
  return {
    id: row.id,
    userId: row.userId,
    resonatorSlug: row.resonatorSlug,
    name: row.name,
    payload: row.payload,
    documentVersion: row.documentVersion,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export function createD1BuildRepository(database: AppDb): BuildRepository {
  return {
    async listByUser(userId) {
      const rows = await database
        .select()
        .from(builds)
        .where(eq(builds.userId, userId))
        .orderBy(desc(builds.updatedAt))

      return rows.map(toRecord)
    },

    async listByUserAndResonator(userId, resonatorSlug) {
      const rows = await database
        .select()
        .from(builds)
        .where(
          and(
            eq(builds.userId, userId),
            eq(builds.resonatorSlug, resonatorSlug)
          )
        )
        .orderBy(desc(builds.updatedAt))

      return rows.map(toRecord)
    },

    async getById(userId, buildId) {
      const [row] = await database
        .select()
        .from(builds)
        .where(and(eq(builds.userId, userId), eq(builds.id, buildId)))
        .limit(1)

      return row ? toRecord(row) : null
    },

    async create(userId: string, data: CreateBuildData) {
      const [row] = await database
        .insert(builds)
        .values({
          id: crypto.randomUUID(),
          userId,
          resonatorSlug: data.resonatorSlug,
          name: data.name,
          payload: data.payload,
          documentVersion: BUILD_DOCUMENT_VERSION,
        })
        .returning()

      return toRecord(row)
    },

    async update(userId, buildId, data: UpdateBuildData) {
      const [row] = await database
        .update(builds)
        .set({
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.payload !== undefined
            ? {
                payload: data.payload,
                documentVersion: BUILD_DOCUMENT_VERSION,
              }
            : {}),
          updatedAt: new Date(),
        })
        .where(and(eq(builds.userId, userId), eq(builds.id, buildId)))
        .returning()

      return row ? toRecord(row) : null
    },

    async delete(userId, buildId) {
      const rows = await database
        .delete(builds)
        .where(and(eq(builds.userId, userId), eq(builds.id, buildId)))
        .returning({ id: builds.id })

      return rows.length > 0
    },

    async deleteByResonator(userId, resonatorSlug) {
      const rows = await database
        .delete(builds)
        .where(
          and(
            eq(builds.userId, userId),
            eq(builds.resonatorSlug, resonatorSlug)
          )
        )
        .returning({ id: builds.id })

      return rows.length
    },
  }
}

export const d1BuildRepository = createD1BuildRepository(db)
