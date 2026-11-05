/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm } from "@/components/form"
import { WeaponRefinementStatFields } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-form-fields"

function Harness({ allowAdd }: { allowAdd: boolean }) {
  const form = useAppForm({
    defaultValues: {
      refinementId: 1,
      sortOrder: 1,
      stats: [{ statName: "atk_percent", value: 18 }],
    },
  })

  return <WeaponRefinementStatFields form={form} allowAdd={allowAdd} />
}

describe("WeaponRefinementStatFields", () => {
  test("renders one stat row with its select and value", () => {
    const html = renderToStaticMarkup(<Harness allowAdd />)

    expect(html).toContain("Seleccionar estadística")
    expect(html).toContain("Valor")
    expect(html).toContain("Agregar estadística adicional")
  })

  test("hides the add button while editing a single stat", () => {
    const html = renderToStaticMarkup(<Harness allowAdd={false} />)

    expect(html).toContain("Valor")
    expect(html).not.toContain("Agregar estadística adicional")
  })
})
