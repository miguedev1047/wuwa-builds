/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { BuildWorkspace } from "@builder/components/workspace"

describe("BuildWorkspace", () => {
  test("renders the stage, preview and rail slots", () => {
    const html = renderToStaticMarkup(
      <BuildWorkspace.Root>
        <BuildWorkspace.Stage>
          <BuildWorkspace.Preview>Canvas</BuildWorkspace.Preview>
        </BuildWorkspace.Stage>
        <BuildWorkspace.Rail>Secciones</BuildWorkspace.Rail>
      </BuildWorkspace.Root>
    )

    expect(html).toContain('data-slot="build-workspace"')
    expect(html).toContain('data-slot="build-workspace-stage"')
    expect(html).toContain('data-slot="build-workspace-preview"')
    expect(html).toContain('data-slot="build-workspace-rail"')
    expect(html).toContain("build-workspace-stage")
    expect(html).toContain("build-canvas-preview")
    expect(html).toContain("<aside")
  })
})
