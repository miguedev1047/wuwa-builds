import type {
  CharacterDetail,
  CharacterSummary,
} from "@catalog/domain/character"
import type { EchoSummary } from "@catalog/domain/echo"
import type { WeaponSummary } from "@catalog/domain/weapon"
import {
  createBuildFromCharacter,
  createEmptyBuild,
} from "@build/application/factories/build"

const character = {
  id: 1,
  name: "Cartethyia",
  introduction: "",
  rarity: 5,
  element: "aero",
  weaponType: "sword",
  icon: "icon",
  card: "card",
  iconLarge: "icon-large",
  circle: "circle",
  portrait: "portrait",
  createdAt: new Date(0),
  updatedAt: new Date(0),
} as CharacterSummary

const detail = {
  skills: Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    skillId: 100 + index,
    name: `Skill ${index}`,
    type: index < 5 ? "Ataque normal" : "Habilidad inherente",
    description: "description",
    icon: "icon",
    media: "media",
  })),
  passives: Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    passiveId: 200 + index,
    title: `Passive ${index}`,
    valueNumber: 8.4,
    icon: "icon",
  })),
} as CharacterDetail

const weapon: WeaponSummary = {
  id: 1,
  name: "Weapon",
  rarity: 5,
  type: 2,
  typeName: "Espada",
  icon: "icon",
  description: "",
  createdAt: new Date(0),
  updatedAt: new Date(0),
}

const echo: EchoSummary = {
  id: 1,
  name: "Echo",
  class: 2,
  cost: 4,
  icon: "icon",
  createdAt: new Date(0),
  updatedAt: new Date(0),
}

function representativeBuild() {
  const build = createBuildFromCharacter({
    buildId: "build",
    sessionId: "session",
    createdAt: new Date(0).toISOString(),
    character,
    detail,
  })

  build.weapon.data = weapon

  build.echoes = build.echoes.map((slot) => ({
    ...slot,
    data: echo,
    cost: echo.cost,
    mainStatLabel: "Ataque %",
    mainStatValue: 33,
    substats: slot.substats.map((substat) => ({
      ...substat,
      valueLabel: "Daño Crít.",
      valueNumber: 21,
    })),
  }))

  return build
}

const emptyBuild = createEmptyBuild({
  buildId: "empty",
  sessionId: "session",
  createdAt: new Date(0).toISOString(),
})

const fullBuild = representativeBuild()

function bytesFor(build: unknown, count: number) {
  return JSON.stringify(build).length * count
}

function formatKiB(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

console.log(`Empty build: ${formatKiB(JSON.stringify(emptyBuild).length)}`)
console.log(`Full build: ${formatKiB(JSON.stringify(fullBuild).length)}`)

for (const count of [12, 50, 100]) {
  console.log(`${count} full builds: ${formatKiB(bytesFor(fullBuild, count))}`)
}
