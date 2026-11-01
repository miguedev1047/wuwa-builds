/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm, withForm } from "@/components/form"

const NumberForm = withForm({
  defaultValues: { quantity: 42 },
  props: {} as { isPending?: boolean },
  render: function Render({ form, isPending }) {
    return (
      <form.AppField name="quantity">
        {(field) => (
          <field.NumberField
            label="Cantidad"
            placeholder="0"
            min={0}
            step="any"
            disabled={isPending}
          />
        )}
      </form.AppField>
    )
  },
})

function Harness({ isPending = false }: { isPending?: boolean }) {
  const form = useAppForm({
    defaultValues: { quantity: 42 },
  })

  return <NumberForm form={form} isPending={isPending} />
}

describe("NumberField", () => {
  test("renders the number field anatomy and the scrub label", () => {
    const html = renderToStaticMarkup(<Harness />)

    expect(html).toContain('data-slot="number-field"')
    expect(html).toContain('data-slot="number-field-scrub-area"')
    expect(html).toContain('data-slot="number-field-group"')
    expect(html).toContain('data-slot="number-field-decrement"')
    expect(html).toContain('data-slot="number-field-input"')
    expect(html).toContain('data-slot="number-field-increment"')
    expect(html).toContain("Cantidad")
  })

  test("binds the form value to the input", () => {
    const html = renderToStaticMarkup(<Harness />)
    const input = html.match(/<input[^>]*>/)?.at(0) ?? ""

    expect(input).toContain('value="42"')
  })

  test("disables the field while pending", () => {
    const html = renderToStaticMarkup(<Harness isPending />)
    const input = html.match(/<input[^>]*>/)?.at(0) ?? ""

    expect(input).toContain("disabled")
  })
})
