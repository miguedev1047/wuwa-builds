import { expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import {
  BuildIdentityProvider,
  useBuildIdentity,
} from "@build/presentation/editor/build-identity"

/** Displays the identity without reading any route or global session. */
function Identity() {
  const { buildId, sessionId } = useBuildIdentity()
  return (
    <span>
      {sessionId}:{buildId}
    </span>
  )
}

test("editor identity is supplied by the host without a router", () => {
  const html = renderToStaticMarkup(
    <BuildIdentityProvider
      identity={{ buildId: "build-a", sessionId: "session-a" }}
    >
      <Identity />
    </BuildIdentityProvider>
  )
  expect(html).toContain("session-a:build-a")
})

test("editor controls fail closed without an explicit identity", () => {
  expect(() => renderToStaticMarkup(<Identity />)).toThrow(
    "BuildIdentityProvider is required"
  )
})
