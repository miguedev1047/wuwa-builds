import { drizzle } from "drizzle-orm/d1"
import { relations } from "@/db/relations"

export function createDb(d1: D1Database) {
  return drizzle(d1, { relations })
}

export type AppDb = ReturnType<typeof createDb>
