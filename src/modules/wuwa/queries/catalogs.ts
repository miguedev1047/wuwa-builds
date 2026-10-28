import { queryOptions } from "@tanstack/react-query"
import type {
  EchoLookup,
  EchoSetLookup,
  WeaponLookup,
} from "../application/schemas"
import {
  getEcho,
  getEchoes,
  getEchoSet,
  getEchoSets,
  getWeapon,
  getWeapons,
} from "../server/catalogs"
import { echoKeys, echoSetKeys, weaponKeys } from "./keys"

/** Shared TanStack Query options for weapons, echoes, and echo sets. */
export const weaponQueries = {
  catalog: () =>
    queryOptions({
      queryKey: weaponKeys.catalog(),
      queryFn: () => getWeapons(),
    }),

  detail: (lookup: WeaponLookup) =>
    queryOptions({
      queryKey: weaponKeys.detail(lookup),
      queryFn: () => getWeapon({ data: lookup }),
    }),
}

export const echoQueries = {
  catalog: () =>
    queryOptions({
      queryKey: echoKeys.catalog(),
      queryFn: () => getEchoes(),
    }),

  detail: (lookup: EchoLookup) =>
    queryOptions({
      queryKey: echoKeys.detail(lookup),
      queryFn: () => getEcho({ data: lookup }),
    }),
}

export const echoSetQueries = {
  catalog: () =>
    queryOptions({
      queryKey: echoSetKeys.catalog(),
      queryFn: () => getEchoSets(),
    }),

  detail: (lookup: EchoSetLookup) =>
    queryOptions({
      queryKey: echoSetKeys.detail(lookup),
      queryFn: () => getEchoSet({ data: lookup }),
    }),
}
