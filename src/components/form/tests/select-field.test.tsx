/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm, withForm } from "@/components/form"

const options = [
  { label: "Luz celestial", value: 5 },
  { label: "Sombra de sueños rotos", value: 32 },
]

const SetSelectForm = withForm({
  defaultValues: { setId: null as number | null },
  render: function Render({ form }) {
    return (
      <form.AppField name="setId">
        {(field) => (
          <field.SelectField
            label="Set de sonata"
            options={options}
            placeholder="Seleccionar set"
          />
        )}
      </form.AppField>
    )
  },
})

function Harness({ setId }: { setId: number | null }) {
  const form = useAppForm({ defaultValues: { setId } })

  return <SetSelectForm form={form} />
}

describe("SelectField", () => {
  test("shows the placeholder instead of a zero when the value is null", () => {
    const html = renderToStaticMarkup(<Harness setId={null} />)

    expect(html).toContain("Seleccionar set")
    expect(html).not.toContain(">0<")
  })

  test("shows the option label once a value is picked", () => {
    const html = renderToStaticMarkup(<Harness setId={32} />)

    expect(html).toContain("Sombra de sueños rotos")
  })
})
