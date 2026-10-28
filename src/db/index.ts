import { env } from "cloudflare:workers"
import { createDb } from "@/db/create"

export { createDb }
export type { AppDb } from "@/db/create"
export const db = createDb(env.wuwa_builds)
