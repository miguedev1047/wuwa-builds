/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { useAppForm, withForm } from "@/components/form"

const TextForm = withForm({
  defaultValues: { name: "" },
  props: { isPending: false },
  render: function Render({ form, isPending }) {
    return (
      <form.AppField name="name">
        {(field) => <field.TextField label="Nombre" disabled={isPending} />}
      </form.AppField>
    )
  },
})

function Harness({ isPending }: { isPending: boolean }) {
  const form = useAppForm({
    defaultValues: { name: "Yangyang" },
  })

  return <TextForm form={form} isPending={isPending} />
}

describe("form composition", () => {
  test("binds the field component to the form value", () => {
    const html = renderToStaticMarkup(<Harness isPending={false} />)

    const input = (html.match(/<input[^>]*>/)?.[0] ?? "").replace(
      / class="[^"]*"/,
      ""
    )

    expect(html).toContain("Nombre")
    expect(input).toContain('value="Yangyang"')
    expect(input).not.toContain("disabled")
  })

  test("passes custom props from withForm down to the fields", () => {
    const html = renderToStaticMarkup(<Harness isPending />)

    const input = (html.match(/<input[^>]*>/)?.[0] ?? "").replace(
      / class="[^"]*"/,
      ""
    )

    expect(input).toContain("disabled")
  })
})
