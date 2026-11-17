import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { CommandSearch } from "@/components/blocks/command-search"

describe("CommandSearch composition", () => {
  test("does not require URL state or reset callbacks", () => {
    const html = renderToStaticMarkup(
      <CommandSearch.Root trigger={<button>Buscar</button>}>
        <CommandSearch.Input placeholder="Nombre o ID" />
      </CommandSearch.Root>
    )
    expect(html).toContain("Buscar")
    expect(html).toContain('aria-haspopup="dialog"')
  })

  test("keeps the trigger renderable without loading the closed dialog's source", () => {
    let queried = false
    function Source(): never {
      queried = true
      throw new Error("Source rendered too early")
    }
    const html = renderToStaticMarkup(
      <CommandSearch.Root trigger={<button>Buscar resonador</button>}>
        <Source />
      </CommandSearch.Root>
    )
    expect(html).toContain("Buscar resonador")
    expect(queried).toBe(false)
  })

  test("items require a search root", () => {
    expect(() =>
      renderToStaticMarkup(
        <CommandSearch.Item value="1">Mortefi</CommandSearch.Item>
      )
    ).toThrow("Command.Item")
  })
})
