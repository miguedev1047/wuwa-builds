import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { BuildBackgroundSelector } from "@build/presentation/editor/sections/appearance-section/components/build-background-selector"

/** Inline background selector for the build appearance inspector section. */
export function AppearanceSection({ build }: { build: BuildProps }) {
  return (
    <section className="flex w-full flex-col gap-3">
      <BuildWorkspace.Text family="bold" textColor="muted" size="xl">
        Apariencia
      </BuildWorkspace.Text>

      <BuildBackgroundSelector backgroundIndex={build.backgroundIndex} />
    </section>
  )
}
