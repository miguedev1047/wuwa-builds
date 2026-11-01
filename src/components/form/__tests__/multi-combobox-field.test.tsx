/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm } from "@/components/form"

const options = [
  { label: "Curación", value: "Curación" },
  { label: "Support", value: "Support" },
]

function Harness({ tags }: { tags: string[] }) {
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
        />
      )}
    </form.AppField>
  )
}

describe("MultiComboboxField", () => {
  test("renders the selected chips", () => {
    const html = renderToStaticMarkup(<Harness tags={["Curación"]} />)

    expect(html).toContain("Etiquetas de rol")
    expect(html).toContain('data-slot="combobox-chips"')
    expect(html).toContain('data-slot="combobox-chip"')
    expect(html).toContain("Curación")
  })

  test("shows the placeholder when there is no selection", () => {
    const html = renderToStaticMarkup(<Harness tags={[]} />)

    expect(html).toContain('placeholder="Agregar etiqueta"')
    expect(html).not.toContain('data-slot="combobox-chip"')
  })
})
