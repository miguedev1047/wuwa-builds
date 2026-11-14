/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

import { BuildCanvas } from "@build/presentation/editor/components/build-canvas/build-canvas"
import { characterDetail } from "@build/__tests__/catalog-fixtures"
import { createBuildFromCharacter } from "@build/application/factories/build"

describe("BuildCanvas", () => {
  test("renders the card from props without workspace providers", () => {
    const character = characterDetail({ id: 1, name: "Cartethyia" })
    const build = createBuildFromCharacter({
      buildId: "build",
      sessionId: "session",
      createdAt: "2026-01-01T00:00:00Z",
      character,
      detail: character,
    })

    const html = renderToStaticMarkup(
      <BuildCanvas
        build={build}
        sequences="Sequences"
        stats="Stats"
        skills="Skills"
      />
    )

    expect(html).toContain('class="build-canvas relative"')
    for (const area of [
      "sequencies",
      "resonator",
      "stats",
      "skills",
      "weapon",
      "echoes",
    ]) {
      expect(html).toContain(`data-canvas-area="${area}"`)
    }
    expect(html).toContain("Cartethyia")
  })
})

describe("BuildWorkspace", () => {
  test("renders the canvas and content slots", () => {
    const html = renderToStaticMarkup(
      <BuildWorkspace.Root>
        <BuildWorkspace.Canvas>
          <BuildWorkspace.Content>Canvas</BuildWorkspace.Content>
        </BuildWorkspace.Canvas>
      </BuildWorkspace.Root>
    )

    expect(html).toContain('data-slot="build-workspace"')
    expect(html).toContain('data-slot="build-workspace-canvas"')
    expect(html).toContain('data-slot="build-workspace-content"')
    expect(html).toContain('data-slot="canvas-pattern"')
    expect(html).toContain('data-slot="canvas-spotlight"')
  })
})
