import { expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import {
  BuildIdentityProvider,
  useBuildIdentity,
} from "@build/presentation/editor/build-identity"

/** Displays the identity without reading any route context. */
function Identity() {
  const { buildId, userId } = useBuildIdentity()
  return (
    <span>
      {userId}:{buildId}
    </span>
  )
}

test("editor identity is supplied by the host without a router", () => {
  const html = renderToStaticMarkup(
    <BuildIdentityProvider identity={{ buildId: "build-a", userId: "user-a" }}>
      <Identity />
    </BuildIdentityProvider>
  )
  expect(html).toContain("user-a:build-a")
})

test("editor controls fail closed without an explicit identity", () => {
  expect(() => renderToStaticMarkup(<Identity />)).toThrow(
    "BuildIdentityProvider is required"
  )
})
