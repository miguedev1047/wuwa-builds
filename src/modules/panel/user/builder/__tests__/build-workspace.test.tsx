/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { BuildWorkspace } from "@builder/components/workspace"

describe("BuildWorkspace", () => {
  test("renders the canvas, content and rail slots", () => {
    const html = renderToStaticMarkup(
      <BuildWorkspace.Root>
        <BuildWorkspace.Canvas>
          <BuildWorkspace.Content>Canvas</BuildWorkspace.Content>
        </BuildWorkspace.Canvas>
        <BuildWorkspace.Rail>Secciones</BuildWorkspace.Rail>
      </BuildWorkspace.Root>
    )

    expect(html).toContain('data-slot="build-workspace"')
    expect(html).toContain('data-slot="build-workspace-canvas"')
    expect(html).toContain('data-slot="build-workspace-content"')
    expect(html).toContain('data-slot="build-workspace-rail"')
    expect(html).toContain('data-slot="canvas-pattern"')
    expect(html).toContain('data-slot="canvas-spotlight"')
    expect(html).toContain("build-canvas-preview")
    expect(html).toContain("<aside")
  })
})
