/// <reference types="bun" />

import { useAppForm } from "@/components/form"
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

const options = [
  { label: "Curación", value: "Curación" },
  { label: "Support", value: "Support" },
  { label: "DPS", value: "DPS" },
  { label: "Healer", value: "Healer" },
]

function Harness({
  tags,
  maxVisibleChips,
}: {
  tags: string[]
  maxVisibleChips?: number
}) {
  const form = useAppForm({
    defaultValues: { tags },
  })

  return (
    <form.AppField name="tags">
      {(field) => (
        <field.MultiComboboxField
          label="Etiquetas de rol"
          options={options}
          placeholder="Agregar etiqueta"
          maxVisibleChips={maxVisibleChips}
        />
      )}
    </form.AppField>
  )
}

describe("MultiComboboxField", () => {
  test("renders the selected chips", () => {
    const html = renderToStaticMarkup(<Harness tags={["Curación"]} />)

    expect(html).toContain("Etiquetas de rol")
    expect(html).toContain('data-slot="combobox-field"')
    expect(html).toContain('aria-label="Remove Curación"')
    expect(html).toContain("Curación")
  })

  test("folds the chips past the limit into a count", () => {
    const html = renderToStaticMarkup(
      <Harness tags={["Curación", "Support", "DPS", "Healer"]} />
    )

    expect(html).toContain('aria-label="Remove Curación"')
    expect(html).toContain('aria-label="Remove Support"')
    expect(html).not.toContain('aria-label="Remove DPS"')
    expect(html).toContain('data-slot="combobox-chip-overflow"')
    expect(html).toContain("+2")
    expect(html).toContain("2 more selected")
  })

  test("takes the chip limit from the field", () => {
    const html = renderToStaticMarkup(
      <Harness
        tags={["Curación", "Support", "DPS", "Healer"]}
        maxVisibleChips={1}
      />
    )

    expect(html).toContain('aria-label="Remove Curación"')
    expect(html).not.toContain('aria-label="Remove Support"')
    expect(html).toContain("+3")
  })

  test("shows the placeholder when there is no selection", () => {
    const html = renderToStaticMarkup(<Harness tags={[]} />)

    expect(html).toContain('placeholder="Agregar etiqueta"')
    expect(html).not.toContain('data-slot="combobox-chip"')
  })
})
