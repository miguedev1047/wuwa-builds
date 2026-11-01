/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm, withForm } from "@/components/form"

const MultiForm = withForm({
  defaultValues: { levels: ["a", "b"] },
  render: function Render({ form }) {
    return (
      <form.AppField name="levels">
        {(field) => (
          <field.SelectMultipleField
            label="Niveles"
            options={[
              { label: "Nivel 1", value: "a" },
              { label: "Nivel 10", value: "b" },
              { label: "Nivel 20", value: "c" },
            ]}
            placeholder="Elegir niveles"
          />
        )}
      </form.AppField>
    )
  },
})

function Harness() {
  const form = useAppForm({ defaultValues: { levels: ["a", "b"] } })

  return <MultiForm form={form} />
}

describe("SelectMultipleField", () => {
  test("joins the labels of the selected values in the trigger", () => {
    const html = renderToStaticMarkup(<Harness />)

    expect(html).toContain('data-slot="select-trigger"')
    expect(html).toContain("Nivel 1, Nivel 10")
  })
})
