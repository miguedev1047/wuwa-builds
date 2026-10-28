import type {
  EchoCatalog,
  EchoSetCatalog,
  WeaponCatalog,
} from "../domain/catalog"
import type { Echo, EchoSet, Weapon } from "../domain/resonator"
import {
  findEcho,
  findEchoSet,
  findWeapon,
  getEchoCatalog,
  getEchoSetCatalog,
  getWeaponCatalog,
} from "../infrastructure/catalogs-bundle.server"
import type { EchoLookup, EchoSetLookup, WeaponLookup } from "./schemas"

/**
 * Read side of the shared catalogs.
 *
 * The data is bundled at build time (`catalogs-bundle.server.ts`), so it works
 * on both Node and workerd.
 */
export async function readWeaponCatalog(): Promise<WeaponCatalog | null> {
  return getWeaponCatalog()
}

export async function readWeapon(lookup: WeaponLookup): Promise<Weapon | null> {
  return findWeapon(lookup)
}

export async function readEchoCatalog(): Promise<EchoCatalog | null> {
  return getEchoCatalog()
}

export async function readEcho(lookup: EchoLookup): Promise<Echo | null> {
  return findEcho(lookup)
}

export async function readEchoSetCatalog(): Promise<EchoSetCatalog | null> {
  return getEchoSetCatalog()
}

export async function readEchoSet(
  lookup: EchoSetLookup
): Promise<EchoSet | null> {
  return findEchoSet(lookup)
}
