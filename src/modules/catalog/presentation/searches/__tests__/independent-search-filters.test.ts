import type { WeaponSummary } from "@catalog/domain/weapon"
import { describe, expect, test } from "bun:test"
import { filterResonatorAdminResults } from "@catalog/presentation/searches/resonators/filter-resonator-admin-results"
import { filterWeaponAdminResults } from "@catalog/presentation/searches/weapons/filter-weapon-admin-results"
import {
  filterEchoAdminResults,
  echoAdminSonataOptions,
} from "@catalog/presentation/searches/echoes/filter-echo-admin-results"
import { filterResonatorBuildResults } from "@build/presentation/editor/searches/resonators/filter-resonator-build-results"
import { filterWeaponBuildResults } from "@build/presentation/editor/searches/weapons/filter-weapon-build-results"
import {
  filterEchoBuildResults,
  echoBuildSonataOptions,
} from "@build/presentation/editor/searches/echoes/filter-echo-build-results"
import {
  characterDetail,
  weaponDetail,
  echoSummary,
} from "@build/__tests__/catalog-fixtures"
import type { EncoreCharacterSummary } from "@encore/domain/character"
import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import type { EncoreEchoSummary } from "@encore/domain/echo"
import type { EchoSelectionSummary } from "@catalog/domain/echo"

const resonatorFilters = {
  search: "",
  rarity: null,
  element: null,
  weaponType: null,
}
const weaponFilters = { search: "", rarity: null, type: null }
const echoFilters = { search: "", class: null, cost: null, sonataId: null }
const mortefi: EncoreCharacterSummary = {
  id: 1204,
  name: "Mortefi",
  icon: "",
  rarity: 4,
  element: "fusion",
  weaponType: "pistols",
}
const yangyang: EncoreCharacterSummary = {
  id: 1402,
  name: "Yangyang",
  icon: "",
  rarity: 4,
  element: "aero",
  weaponType: "sword",
}
const sword: EncoreWeaponSummary = {
  id: 2102,
  name: "Espada",
  icon: "",
  rarity: 5,
  type: "sword",
}
const broadblade: EncoreWeaponSummary = {
  id: 2101,
  name: "Rastro de otoño",
  icon: "",
  rarity: 4,
  type: "broadblade",
}
const encoreEcho: EncoreEchoSummary = {
  id: 1,
  name: "Jefemico",
  icon: "",
  class: "elite",
  cost: 3,
  sets: [
    {
      id: 99,
      name: "Solo Encore",
      icon: "https://example.com/sonata.webp",
      effects: [],
    },
  ],
}
const catalogEcho: EchoSelectionSummary = {
  ...echoSummary({ id: 1, cost: 3 }),
  class: "elite",
  sets: [
    {
      setId: 9,
      name: "Solo catálogo",
      icon: "https://example.com/catalog-sonata.webp",
    },
  ],
}

describe("six independent result filters", () => {
  test("admin resonators combine text, id and category filters on Encore data", () => {
    const items = [mortefi, yangyang]
    expect(
      filterResonatorAdminResults({
        items,
        filters: {
          search: "mort 1204",
          rarity: 4,
          element: "fusion",
          weaponType: "pistols",
        },
      })
    ).toEqual([mortefi])
    expect(
      filterResonatorAdminResults({
        items,
        filters: { ...resonatorFilters, element: "aero" },
      })
    ).toEqual([yangyang])
    expect(
      filterResonatorAdminResults({
        items,
        filters: { ...resonatorFilters, rarity: 5 },
      })
    ).toEqual([])
  })

  test("builder resonators never expand their catalog subset", () => {
    const item = characterDetail({
      id: 1204,
      name: "Mortefi",
      element: "fusion",
      weaponType: "pistols",
    })
    expect(
      filterResonatorBuildResults({
        items: [item],
        filters: resonatorFilters,
      })[0]
    ).toBe(item)
    expect(
      filterResonatorBuildResults({
        items: [item],
        filters: { ...resonatorFilters, search: "Yangyang" },
      })
    ).toEqual([])
  })

  test("admin weapons search Encore names, ids and type labels", () => {
    expect(
      filterWeaponAdminResults({
        items: [sword, broadblade],
        filters: { ...weaponFilters, search: "2101 Mandoble" },
      })
    ).toEqual([broadblade])
    expect(
      filterWeaponAdminResults({
        items: [sword],
        filters: { ...weaponFilters, rarity: 4 },
      })
    ).toEqual([])
  })

  test("builder weapon compatibility is applied before user filters can widen results", () => {
    const a: WeaponSummary = {
      ...weaponDetail(),
      id: 1,
      type: "sword",
      rarity: 5,
    }
    const b: WeaponSummary = {
      ...weaponDetail(),
      id: 2,
      type: "broadblade",
      rarity: 4,
    }
    expect(
      filterWeaponBuildResults({
        items: [a, b],
        filters: weaponFilters,
        weaponType: "sword",
      })
    ).toEqual([a])
    expect(
      filterWeaponBuildResults({
        items: [a, b],
        filters: { ...weaponFilters, type: "broadblade" },
        weaponType: "sword",
      })
    ).toEqual([])
  })

  test("admin echoes use Encore sonata ids and do not consult D1 options", () => {
    expect(
      filterEchoAdminResults({
        items: [encoreEcho],
        filters: { search: "Jefe", class: "elite", cost: 3, sonataId: 99 },
      })
    ).toEqual([encoreEcho])
    expect(echoAdminSonataOptions([encoreEcho, encoreEcho])).toEqual([
      {
        value: 99,
        label: "Solo Encore",
        icon: "https://example.com/sonata.webp",
      },
    ])
    expect(
      filterEchoAdminResults({
        items: [encoreEcho],
        filters: { ...echoFilters, sonataId: 9 },
      })
    ).toEqual([])
  })

  test("builder echoes use catalog associations and preserve their selection rows", () => {
    expect(
      filterEchoBuildResults({
        items: [catalogEcho],
        filters: { ...echoFilters, sonataId: 9 },
      })[0]
    ).toBe(catalogEcho)
    expect(echoBuildSonataOptions([catalogEcho])).toEqual([
      {
        value: 9,
        label: "Solo catálogo",
        icon: "https://example.com/catalog-sonata.webp",
      },
    ])
    expect(
      filterEchoBuildResults({
        items: [catalogEcho],
        filters: { ...echoFilters, cost: 4 },
      })
    ).toEqual([])
    expect(filterEchoBuildResults({ items: [], filters: echoFilters })).toEqual(
      []
    )
  })
})
