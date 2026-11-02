/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  resonatorInput,
  resonatorPassiveInput,
  resonatorPassivesInput,
  resonatorPropertyGrowthInput,
  resonatorPropertyGrowthInputs,
  resonatorPropertyLevelsSchema,
  resonatorSequenceInput,
  resonatorSequencesInput,
  resonatorSkillFormInput,
  resonatorSkillInput,
  resonatorSkillsInput,
  resonatorTagsInput,
  resonatorTagsSelectionInput,
  weaponInput,
  weaponPropertyGrowthInput,
  weaponPropertyGrowthInputs,
  weaponPropertyInput,
} from "@/modules/panel/admin/game-data/application/schemas"

const valid = {
  id: 1402,
  name: "  Cartethyia  ",
  introduction: "Resonadora de Rinascita",
  rarity: 5,
  element: "Aero",
  weaponType: "Espada",
  icon: "",
}

describe("resonatorInput", () => {
  test("trims text and accepts a valid resonator", () => {
    const parsed = resonatorInput.parse(valid)

    expect(parsed.name).toBe("Cartethyia")
    expect(parsed.rarity).toBe(5)
  })

  test("rejects an empty name", () => {
    const result = resonatorInput.safeParse({ ...valid, name: "   " })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe("El nombre es obligatorio")
  })

  test("rejects a rarity outside 1..5", () => {
    const low = resonatorInput.safeParse({ ...valid, rarity: 0 })
    const high = resonatorInput.safeParse({ ...valid, rarity: 6 })

    expect(low.success).toBe(false)
    expect(high.success).toBe(false)
    expect(high.error?.issues[0]?.message).toBe("La rareza maxima es 5")
  })

  test("requires element and weapon type", () => {
    const result = resonatorInput.safeParse({
      ...valid,
      element: "",
      weaponType: "",
    })

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "element",
      "weaponType",
    ])
  })

  test("requires a positive id", () => {
    const missing = resonatorInput.safeParse({ ...valid, id: 0 })

    expect(missing.success).toBe(false)
    expect(missing.error?.issues[0]?.message).toBe("El ID es requerido")
  })

  test("keeps the id and ignores the database timestamps", () => {
    const parsed = resonatorInput.parse({
      ...valid,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    expect(parsed.id).toBe(1402)
    expect(parsed).not.toHaveProperty("createdAt")
    expect(parsed).not.toHaveProperty("updatedAt")
  })
})

describe("weaponInput", () => {
  const valid = {
    id: 21050016,
    name: "  Maestro de cuerdas  ",
    rarity: 5,
    type: 5,
    icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
    description: "El palmo de la marioneta se abre.",
  }

  test("trims text and accepts a valid weapon", () => {
    const parsed = weaponInput.parse(valid)

    expect(parsed.name).toBe("Maestro de cuerdas")
    expect(parsed.type).toBe(5)
  })

  test("rejects an empty name", () => {
    const result = weaponInput.safeParse({ ...valid, name: "   " })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe("El nombre es obligatorio")
  })

  test("requires the id", () => {
    const missing = weaponInput.safeParse({ ...valid, id: undefined })
    const zero = weaponInput.safeParse({ ...valid, id: 0 })

    expect(missing.success).toBe(false)
    expect(zero.success).toBe(false)
    expect(zero.error?.issues[0]?.message).toBe("El ID es requerido")
  })

  test("rejects a rarity or type outside 1..5", () => {
    expect(weaponInput.safeParse({ ...valid, rarity: 0 }).success).toBe(false)
    expect(weaponInput.safeParse({ ...valid, rarity: 6 }).success).toBe(false)
    expect(weaponInput.safeParse({ ...valid, type: 0 }).success).toBe(false)
    expect(weaponInput.safeParse({ ...valid, type: 6 }).success).toBe(false)
  })

  test("ignores the derived type name and the database timestamps", () => {
    const parsed = weaponInput.parse({
      ...valid,
      typeName: "Rectificador",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    expect(parsed).not.toHaveProperty("typeName")
    expect(parsed).not.toHaveProperty("createdAt")
    expect(parsed).not.toHaveProperty("updatedAt")
  })
})

describe("weaponPropertyInput", () => {
  const valid = {
    weaponId: 21050016,
    sortOrder: 1,
    name: "Ataque",
    baseValue: 40,
    icon: "https://api-v2.encore.moe/resource/Data/atk.webp",
  }

  test("accepts the property payload, including a zero base value", () => {
    expect(weaponPropertyInput.parse(valid)).toEqual(valid)
    expect(weaponPropertyInput.safeParse({ ...valid, baseValue: 0 }).success).toBe(
      true
    )
  })

  test("requires the name, the icon and a non negative base value", () => {
    const result = weaponPropertyInput.safeParse({
      ...valid,
      name: "",
      icon: "",
      baseValue: -1,
    })

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "name",
      "icon",
      "baseValue",
    ])
  })

  test("requires the weapon id and the sort order", () => {
    expect(
      weaponPropertyInput.safeParse({ ...valid, weaponId: 0 }).success
    ).toBe(false)
    expect(
      weaponPropertyInput.safeParse({ ...valid, sortOrder: 0 }).success
    ).toBe(false)
  })
})

describe("weaponPropertyGrowthInput", () => {
  const valid = {
    propertyId: 5,
    sortOrder: 1,
    level: 10,
    value: "75.63",
  }

  test("accepts decimals and percentages", () => {
    expect(weaponPropertyGrowthInput.parse(valid)).toEqual(valid)
    expect(
      weaponPropertyGrowthInput.safeParse({ ...valid, value: "16.05%" }).success
    ).toBe(true)
  })

  test("rejects levels outside 1..90", () => {
    expect(
      weaponPropertyGrowthInput.safeParse({ ...valid, level: 0 }).success
    ).toBe(false)
    expect(
      weaponPropertyGrowthInput.safeParse({ ...valid, level: 91 }).success
    ).toBe(false)
  })

  test("rejects empty or non numeric values", () => {
    expect(
      weaponPropertyGrowthInput.safeParse({ ...valid, value: " " }).success
    ).toBe(false)
    expect(
      weaponPropertyGrowthInput.safeParse({ ...valid, value: "abc" }).success
    ).toBe(false)
  })

  test("bulk payloads require at least one level and cap at ten", () => {
    expect(weaponPropertyGrowthInputs.safeParse([valid]).success).toBe(true)
    expect(weaponPropertyGrowthInputs.safeParse([]).success).toBe(false)

    const eleven = Array.from({ length: 11 }, (_, index) => ({
      ...valid,
      sortOrder: index + 1,
    }))

    expect(weaponPropertyGrowthInputs.safeParse(eleven).success).toBe(false)
  })
})

describe("resonatorPropertyLevelsSchema", () => {
  const valid = {
    resonatorId: 1104,
    sortOrder: 1,
    name: "Vida",
    baseValue: 831,
    icon: "https://api-v2.encore.moe/icon.webp",
  }

  test("accepts the property level payload", () => {
    expect(resonatorPropertyLevelsSchema.parse(valid)).toEqual(valid)
  })

  test("accepts a zero base value", () => {
    const result = resonatorPropertyLevelsSchema.safeParse({
      ...valid,
      baseValue: 0,
    })

    expect(result.success).toBe(true)
  })

  test("requires the name and the icon", () => {
    const result = resonatorPropertyLevelsSchema.safeParse({
      ...valid,
      name: "",
      icon: "",
    })

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "name",
      "icon",
    ])
  })

  test("requires a positive sort order", () => {
    expect(
      resonatorPropertyLevelsSchema.safeParse({ ...valid, sortOrder: 0 })
        .success
    ).toBe(false)
  })
})

describe("resonatorPropertyGrowthInput", () => {
  const valid = {
    propertyId: 12,
    sortOrder: 1,
    level: 90,
    value: "824",
  }

  test("accepts a numeric value and trims it", () => {
    expect(
      resonatorPropertyGrowthInput.parse({ ...valid, value: " 824 " }).value
    ).toBe("824")
  })

  test("accepts a percentage value", () => {
    expect(
      resonatorPropertyGrowthInput.safeParse({ ...valid, value: "5.2%" })
        .success
    ).toBe(true)
  })

  test("rejects levels outside 1..90", () => {
    expect(
      resonatorPropertyGrowthInput.safeParse({ ...valid, level: 0 }).success
    ).toBe(false)
    expect(
      resonatorPropertyGrowthInput.safeParse({ ...valid, level: 91 }).success
    ).toBe(false)
  })

  test("rejects empty or non numeric values", () => {
    expect(
      resonatorPropertyGrowthInput.safeParse({ ...valid, value: " " }).success
    ).toBe(false)
    expect(
      resonatorPropertyGrowthInput.safeParse({ ...valid, value: "abc" }).success
    ).toBe(false)
  })
})

describe("resonatorSkillInput", () => {
  const valid = {
    resonatorId: 1311,
    skillId: 1006102,
    sortOrder: 1,
    type: "  Habilidad de resonancia  ",
    name: "  Al corazon bajo la luna  ",
    description: "<span>Descripcion</span>",
    icon: "icon.webp",
    media: "skill.mp4",
  }

  test("trims the text fields and accepts a valid skill", () => {
    const parsed = resonatorSkillInput.parse(valid)

    expect(parsed.type).toBe("Habilidad de resonancia")
    expect(parsed.name).toBe("Al corazon bajo la luna")
  })

  test("rejects empty name and type", () => {
    const result = resonatorSkillInput.safeParse({
      ...valid,
      name: " ",
      type: "",
    })

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "type",
      "name",
    ])
  })

  test("requires a positive skill id", () => {
    expect(
      resonatorSkillInput.safeParse({ ...valid, skillId: 0 }).success
    ).toBe(false)
  })

  test("the form schema accepts the create id of zero", () => {
    expect(resonatorSkillFormInput.safeParse({ ...valid, id: 0 }).success).toBe(
      true
    )
  })
})

describe("resonatorSequenceInput", () => {
  const valid = {
    resonatorId: 1311,
    sequenceId: 355,
    sortOrder: 1,
    index: 1,
    name: "  Bote, rompe la marea creciente  ",
    description: "<p>Descripcion</p>",
  }

  test("trims the name and accepts a valid sequence", () => {
    expect(resonatorSequenceInput.parse(valid).name).toBe(
      "Bote, rompe la marea creciente"
    )
  })

  test("rejects indexes outside 1..6", () => {
    expect(
      resonatorSequenceInput.safeParse({ ...valid, index: 0 }).success
    ).toBe(false)
    expect(
      resonatorSequenceInput.safeParse({ ...valid, index: 7 }).success
    ).toBe(false)
  })

  test("requires a name", () => {
    expect(
      resonatorSequenceInput.safeParse({ ...valid, name: " " }).success
    ).toBe(false)
  })
})

describe("resonatorPassiveInput", () => {
  const valid = {
    resonatorId: 1311,
    passiveId: 155,
    sortOrder: 1,
    title: "  ATQ+  ",
    valueNumber: 1.8,
    icon: "passive.webp",
  }

  test("trims the title and accepts a valid passive", () => {
    expect(resonatorPassiveInput.parse(valid).title).toBe("ATQ+")
  })

  test("rejects an empty title", () => {
    expect(
      resonatorPassiveInput.safeParse({ ...valid, title: " " }).success
    ).toBe(false)
  })

  test("requires a positive passive id", () => {
    expect(
      resonatorPassiveInput.safeParse({ ...valid, passiveId: 0 }).success
    ).toBe(false)
  })

  test("requires a numeric value", () => {
    expect(
      resonatorPassiveInput.safeParse({ ...valid, valueNumber: "1.8" }).success
    ).toBe(false)
  })
})

describe("bulk input schemas", () => {
  const skill = {
    resonatorId: 1311,
    skillId: 1006102,
    sortOrder: 1,
    type: "Habilidad de resonancia",
    name: "Al corazon bajo la luna",
    description: "<p>Descripcion</p>",
    icon: "icon.webp",
    media: "skill.mp4",
  }
  const sequence = {
    resonatorId: 1311,
    sequenceId: 355,
    sortOrder: 1,
    index: 1,
    name: "Bote",
    description: "<p>Descripcion</p>",
  }
  const passive = {
    resonatorId: 1311,
    passiveId: 155,
    sortOrder: 1,
    title: "ATQ+",
    valueNumber: 1.8,
    icon: "passive.webp",
  }
  const growth = {
    propertyId: 1,
    sortOrder: 1,
    level: 1,
    value: "824",
  }

  test("accept multiple items in one payload", () => {
    expect(resonatorSkillsInput.safeParse([skill, skill]).success).toBe(true)
    expect(
      resonatorSequencesInput.safeParse([sequence, sequence]).success
    ).toBe(true)
    expect(resonatorPassivesInput.safeParse([passive, passive]).success).toBe(
      true
    )
    expect(
      resonatorPropertyGrowthInputs.safeParse([growth, growth]).success
    ).toBe(true)
  })

  test("reject empty arrays", () => {
    expect(resonatorSkillsInput.safeParse([]).success).toBe(false)
    expect(resonatorSequencesInput.safeParse([]).success).toBe(false)
    expect(resonatorPassivesInput.safeParse([]).success).toBe(false)
    expect(resonatorPropertyGrowthInputs.safeParse([]).success).toBe(false)
  })

  test("reject the whole payload when one item is invalid", () => {
    expect(
      resonatorSkillsInput.safeParse([skill, { ...skill, name: " " }]).success
    ).toBe(false)
    expect(
      resonatorSequencesInput.safeParse([sequence, { ...sequence, index: 7 }])
        .success
    ).toBe(false)
    expect(
      resonatorPassivesInput.safeParse([passive, { ...passive, title: " " }])
        .success
    ).toBe(false)
    expect(
      resonatorPropertyGrowthInputs.safeParse([
        growth,
        { ...growth, value: "abc" },
      ]).success
    ).toBe(false)
  })
})

describe("resonatorTagsInput", () => {
  const tag = (index: number) => ({
    name: `Etiqueta ${index}`,
    description: "",
    color: "",
    icon: "",
  })

  test("accepts up to eight tags", () => {
    const tags = Array.from({ length: 8 }, (_, index) => tag(index))

    expect(resonatorTagsInput.safeParse({ resonatorId: 1, tags }).success).toBe(
      true
    )
  })

  test("rejects more than eight tags", () => {
    const tags = Array.from({ length: 9 }, (_, index) => tag(index))
    const result = resonatorTagsInput.safeParse({ resonatorId: 1, tags })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe("Maximo 8 etiquetas")
  })
})

describe("resonatorTagsSelectionInput", () => {
  test("rejects empty tag names", () => {
    expect(
      resonatorTagsSelectionInput.safeParse({ tags: ["  "] }).success
    ).toBe(false)
  })

  test("accepts a list of names", () => {
    const result = resonatorTagsSelectionInput.safeParse({ tags: ["Curación"] })

    expect(result.success).toBe(true)
    expect(result.data?.tags).toEqual(["Curación"])
  })
})
