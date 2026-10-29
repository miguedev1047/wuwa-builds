import { z } from "zod"

/**
 * Version of the build payload shape. It is not a revision counter: bump it
 * when the JSON document format changes so old rows can be migrated or
 * rejected explicitly.
 */
export const BUILD_DOCUMENT_VERSION = 1

export const CHARACTER_LEVEL_MAX = 90
export const WEAPON_LEVEL_MAX = 90
export const ECHO_LEVEL_MAX = 25
export const SEQUENCE_RANK_MAX = 6
export const SKILL_LEVEL_MAX = 10
export const REFINEMENT_RANK_MAX = 5
export const ECHO_SLOT_COUNT = 5
export const SUBSTATS_PER_ECHO_MAX = 5

const numericId = z.number().int().positive()

export const skillLevelSchema = z.object({
  skillId: numericId,
  level: z.number().int().min(1).max(SKILL_LEVEL_MAX),
})

export type SkillLevel = z.infer<typeof skillLevelSchema>

export const echoSubstatSchema = z.object({
  statId: z.string().min(1),
  /**
   * Display units: percentage points for percent stats (e.g. 6.3 for 6.3%),
   * flat values otherwise. The stat registry defines the kind of each key.
   */
  value: z.number().finite(),
})

export const echoSlotSchema = z.object({
  echoId: numericId.nullable(),
  level: z.number().int().min(0).max(ECHO_LEVEL_MAX),
  mainStatId: z.string().min(1).nullable(),
  /** Only set when the user explicitly picks a sonata for this echo. */
  sonataId: numericId.nullable(),
  substats: z.array(echoSubstatSchema).max(SUBSTATS_PER_ECHO_MAX),
})

export type EchoSlot = z.infer<typeof echoSlotSchema>
export type EchoSubstat = z.infer<typeof echoSubstatSchema>

export const buildPayloadSchema = z.object({
  resonator: z.object({
    level: z.number().int().min(1).max(CHARACTER_LEVEL_MAX),
    /** 0 = S0, 6 = S6. Sequences are linear, not independent toggles. */
    sequenceRank: z.number().int().min(0).max(SEQUENCE_RANK_MAX),
    skillLevels: z.array(skillLevelSchema).max(10),
  }),
  weapon: z.object({
    weaponId: numericId.nullable(),
    level: z.number().int().min(1).max(WEAPON_LEVEL_MAX),
    refinementRank: z.number().int().min(1).max(REFINEMENT_RANK_MAX),
  }),
  echoLoadout: z.tuple([
    echoSlotSchema,
    echoSlotSchema,
    echoSlotSchema,
    echoSlotSchema,
    echoSlotSchema,
  ]),
  /** Index into echoLoadout, or null when no main echo is selected. */
  mainEchoSlot: z
    .union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
    ])
    .nullable(),
  notes: z.string().max(2000),
})

export type BuildPayload = z.infer<typeof buildPayloadSchema>

export const buildDocumentSchema = z.object({
  documentVersion: z.literal(BUILD_DOCUMENT_VERSION),
  payload: buildPayloadSchema,
})

export function createEmptyEchoSlot(): EchoSlot {
  return {
    echoId: null,
    level: 0,
    mainStatId: null,
    sonataId: null,
    substats: [],
  }
}

/** Fresh, independent nested objects for every new draft. */
export function createEmptyBuildPayload(): BuildPayload {
  return {
    resonator: {
      level: CHARACTER_LEVEL_MAX,
      sequenceRank: 0,
      skillLevels: [],
    },
    weapon: {
      weaponId: null,
      level: WEAPON_LEVEL_MAX,
      refinementRank: 1,
    },
    echoLoadout: [
      createEmptyEchoSlot(),
      createEmptyEchoSlot(),
      createEmptyEchoSlot(),
      createEmptyEchoSlot(),
      createEmptyEchoSlot(),
    ],
    mainEchoSlot: null,
    notes: "",
  }
}
