/// <reference types="bun" />

import { QuerySelect } from "@/components/blocks/query-select"
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

describe("QuerySelect", () => {
  test("renders its controlled selection placeholder", () => {
    const html = renderToStaticMarkup(
      <QuerySelect
        items={[
          { label: "Élite", value: 1 },
          { label: "Jefe", value: 2 },
        ]}
        value={null}
        onValueChange={() => undefined}
        placeholder="Filtrar por clase"
      />
    )

    expect(html).toContain("Filtrar por clase")
    expect(html).toContain('aria-haspopup="listbox"')
  })
})
