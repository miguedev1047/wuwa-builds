import { BACKGROUNDS } from "@build/application/backgrounds"
import { updateBuild } from "@build/client/build-store"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { Image } from "@/components/ui/image"
import { cn } from "cn"

type BuildBackgroundSelectorProps = {
  /** Index of the currently selected build background. */
  backgroundIndex: number | null
}

/** Displays and updates the local background selected for a build. */
export function BuildBackgroundSelector({
  backgroundIndex,
}: BuildBackgroundSelectorProps) {
  const { buildId, sessionId } = useBuildIdentity()

  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Fondos</BuildWorkspace.Text>
      <div className="grid grid-cols-3 gap-2">
        {BACKGROUNDS.map((background, index) => (
          <button
            key={background}
            type="button"
            aria-label={`Fondo ${index + 1}`}
            aria-pressed={backgroundIndex === index}
            onClick={() =>
              updateBuild({ buildId, sessionId }, (current) => {
                current.backgroundIndex = index
              })
            }
            className={cn(
              "overflow-hidden rounded-lg border-2 bg-accent shadow-brand-warning/20 transition-colors",
              backgroundIndex === index
                ? "border-brand-warning shadow-2xl"
                : "border-transparent hover:border-border"
            )}
          >
            <Image
              src={background}
              alt=""
              aspect="square"
              size="full"
              rounded="lg"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
