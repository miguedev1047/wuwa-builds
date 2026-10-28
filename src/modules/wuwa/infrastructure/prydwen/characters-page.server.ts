import type { CharacterCard } from "../../domain/resonator"

/**
 * Extracts the resonator cards from the characters index page. This page does
 * not expose a JSON payload for the roster, so the cards are read from the
 * server-rendered HTML.
 */
export function readCharacterCards(html: string): CharacterCard[] {
  const pattern =
    /<a href="\/wuthering-waves\/characters\/([^"/]+)"><div class="avatar pw-card ww rarity-(\d)[^"]*"><img alt="([^"]*)"[^>]*src="([^"]+)"[\s\S]{0,400}?element_([a-z]+)\.webp/g

  return [...html.matchAll(pattern)].map((match) => ({
    slug: match[1],
    name: match[3],
    rarity: Number(match[2]),
    element: match[5][0].toUpperCase() + match[5].slice(1),
    cardImage: match[4],
  }))
}
