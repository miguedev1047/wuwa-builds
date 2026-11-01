export const RESONATOR_RARITY = [
  {
    label: "5 Estrellas",
    value: 5,
  },
  {
    label: "4 Estrellas",
    value: 4,
  },
  {
    label: "3 Estrellas",
    value: 3,
  },
  {
    label: "2 Estrellas",
    value: 2,
  },
  {
    label: "1 Estrella",
    value: 1,
  },
]

/** Element names as returned by the Encore API (`es`). */
export const RESONATOR_ELEMENTS = [
  { label: "Aero", value: "Aero" },
  { label: "Destrucción", value: "Destrucción" },
  { label: "Electro", value: "Electro" },
  { label: "Espectro", value: "Espectro" },
  { label: "Fusión", value: "Fusión" },
  { label: "Gelio", value: "Gelio" },
]

/** Weapon type names as returned by the Encore API (`es`). */
export const RESONATOR_WEAPON_TYPES = [
  { label: "Brazales", value: "Brazales" },
  { label: "Espada", value: "Espada" },
  { label: "Mandoble", value: "Mandoble" },
  { label: "Pistolas", value: "Pistolas" },
  { label: "Rectificador", value: "Rectificador" },
]

/**
 * Base stats a resonator can have in `resonator_property_levels`.
 *
 * `encoreName` is the label the Encore API uses, so the panel can prefill the
 * form with a saved property the user already knows from the game.
 */
export const RESONATOR_PROPERTY_NAMES = [
  { label: "Ataque", value: "Ataque", encoreName: "ATQ" },
  { label: "Vida", value: "Vida", encoreName: "PS" },
  { label: "Defensa", value: "Defensa", encoreName: "DEF" },
  { label: "Prob. Criti.", value: "Prob. Criti.", encoreName: "Prob. CRIT" },
  { label: "Dano Crit.", value: "Dano Crit.", encoreName: "Daño CRIT" },
  {
    label: "Impulso de Ruptura de Tonalidad",
    value: "Impulso de Ruptura de Tonalidad",
    encoreName: "Impulso de Ruptura de Tonalidad",
  },
] as const
