import type {
  Calculation,
  CharacterCard,
  DamageDistribution,
  Echo,
  EchoBuild,
  EchoSet,
  EchoStatBuild,
  Rating,
  Resonator,
  ResonatorBuild,
  ResonatorIndexEntry,
  ResonatorProfile,
  ResonatorReference,
  ResonatorStats,
  ResonatorTiers,
  SkillOrder,
  Synergy,
  TeamComp,
  TierConfigEntry,
  Weapon,
  WeaponBuild,
} from "../../domain/resonator"

interface CharacterPayload extends Record<string, unknown> {
  character?: ResonatorProfile & {
    cardImage?: string | null
    fullImage?: string | null
  }
  lastUpdate?: ResonatorBuild["lastUpdate"]
  weaponBuilds?: WeaponBuild[]
  echoBuilds?: EchoBuild[]
  echoStatBuilds?: EchoStatBuild[]
  skillOrders?: SkillOrder[]
  teams?: TeamComp[]
  synergies?: Synergy[]
  statsData?: ResonatorStats[]
  calcs?: Calculation[]
  dmgDistribution?: DamageDistribution
  weapons?: Weapon[]
  echoes?: Echo[]
  echoSets?: EchoSet[]
  tierConfig?: TierConfigEntry[]
  headings?: Record<string, unknown>
  valueRatings?: Rating[]
  ratings?: Rating[]
}

function asPayload(payload: Record<string, unknown>): CharacterPayload {
  return payload as CharacterPayload
}

export function toResonator(
  rawPayload: Record<string, unknown>,
  source: string
): Resonator {
  const payload = asPayload(rawPayload)
  const character = payload.character

  if (!character) {
    throw new Error(`No character data in payload from ${source}`)
  }

  const {
    cardImage = null,
    fullImage = null,
    ...profile
  } = character as ResonatorProfile & {
    cardImage?: string | null
    fullImage?: string | null
  }

  const stats =
    payload.statsData?.find((entry) => entry.slug === profile.slug) ?? null

  const reference: ResonatorReference = {
    weapons: payload.weapons ?? [],
    echoes: payload.echoes ?? [],
    echoSets: payload.echoSets ?? [],
    tierConfig: payload.tierConfig ?? [],
    headings: payload.headings ?? {},
  }

  return {
    source,
    fetchedAt: new Date().toISOString(),
    slug: profile.slug,
    name: profile.name,
    rarity: profile.rarity,
    element: profile.element,
    weapon: profile.weapon,
    upcoming: Boolean(profile.upcoming),
    updatedAt: profile.updatedAt ?? null,
    images: { card: cardImage, full: fullImage },
    profile,
    build: {
      lastUpdate: payload.lastUpdate ?? null,
      weapons: payload.weaponBuilds ?? [],
      echoes: payload.echoBuilds ?? [],
      echoStats: payload.echoStatBuilds ?? [],
      skillPriority: payload.skillOrders ?? [],
      teams: payload.teams ?? [],
      synergies: payload.synergies ?? [],
    },
    stats,
    calculations: payload.calcs ?? [],
    damageDistribution: payload.dmgDistribution ?? [],
    reference,
    valueRatings: payload.valueRatings ?? [],
  }
}

export function tiersFromRating(rating: Rating): ResonatorTiers {
  return {
    towerOfAdversity: {
      category: rating.toa_cat || null,
      rating: rating.toa_rating || null,
      tags: rating.toa_tags || null,
      marks: rating.toa_marks || null,
      expert: Boolean(rating.toa_expert),
    },
    whimperingWastes: {
      category: rating.ww_cat || null,
      rating: rating.ww_rating || null,
      tags: rating.ww_tags || null,
      marks: rating.ww_marks || null,
      expert: Boolean(rating.ww_expert),
    },
    overall: {
      category: rating.overall_cat || null,
      rating: rating.overall_rating || null,
      tags: rating.overall_tags || null,
      marks: rating.overall_marks || null,
    },
  }
}

/**
 * Builds a roster entry. Tier ratings only come from freshly scraped pages, so
 * cached runs fall back to the previously stored entry (e.g. `--only aalto`).
 */
export function toIndexEntry(
  card: CharacterCard,
  rating: Rating | null,
  previous: ResonatorIndexEntry | null
): ResonatorIndexEntry {
  return {
    slug: card.slug,
    name: card.name,
    rarity: card.rarity,
    element: card.element,
    cardImage: card.cardImage,
    dupes: rating?.dupes ?? previous?.dupes ?? null,
    tiers: rating ? tiersFromRating(rating) : (previous?.tiers ?? null),
  }
}
