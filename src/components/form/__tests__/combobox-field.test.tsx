/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm, withForm } from "@/components/form"

const options = [
  { label: "Cartethyia", value: 1203 },
  { label: "Verina", value: 1204 },
]

const CharacterForm = withForm({
  defaultValues: { character: null as string | null },
  render: function Render({ form }) {
    return (
      <form.AppField name="character">
        {(field) => (
          <field.ComboboxField
            label="Resonador"
            options={options}
            placeholder="Buscar resonador"
          />
        )}
      </form.AppField>
    )
  },
})

function Harness({ character }: { character: string | null }) {
  const form = useAppForm({ defaultValues: { character } })

  return <CharacterForm form={form} />
}

describe("ComboboxField", () => {
  test("shows the placeholder when nothing is selected", () => {
    const html = renderToStaticMarkup(<Harness character={null} />)

    expect(html).toContain("Buscar resonador")
    expect(html).toContain('data-slot="input-group-control"')
  })

  test("shows the option label for the stored id", () => {
    const html = renderToStaticMarkup(<Harness character="1203" />)

    expect(html).toContain("Cartethyia")
  })

  test("keeps the id out of the input value", () => {
    const html = renderToStaticMarkup(<Harness character="1203" />)
    const input = html.match(/<input[^>]*>/)?.at(0) ?? ""

    expect(input).not.toContain("1203")
  })
})
