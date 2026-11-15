import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { BACKGROUNDS } from "@build/application/backgrounds"
import { updateBuild } from "@build/client/build-store"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { Image } from "@/components/ui/image"
import { cn } from "cn"
import { CustomBackgroundDialog } from "./components/custom-background-dialog"

/** Inline background selector for the build appearance inspector section. */
export function AppearanceSection({ build }: { build: BuildProps }) {
  const { buildId, sessionId } = useBuildIdentity()

  return (
    <section className="flex w-full flex-col gap-3">
      <BuildWorkspace.Text family="bold" textColor="muted" size="xl">
        Apariencia
      </BuildWorkspace.Text>
      <p className="text-xs text-muted-foreground">Fondo de la build</p>
      <div className="grid grid-cols-3 gap-2">
        <CustomBackgroundDialog
          activeBackground={
            build.backgroundUrl ?? BACKGROUNDS[build.backgroundIndex ?? 0]
          }
          activeBackgroundUrl={build.backgroundUrl}
        />
        {BACKGROUNDS.map((background, index) => (
          <button
            key={background}
            type="button"
            aria-label={`Fondo ${index + 1}`}
            aria-pressed={
              !build.backgroundUrl && build.backgroundIndex === index
            }
            onClick={() =>
              updateBuild({ buildId, sessionId }, (current) => {
                current.backgroundIndex = index
                current.backgroundUrl = null
              })
            }
            className={cn(
              "overflow-hidden rounded-lg border-2 bg-accent shadow-brand-warning/20 transition-colors",
              !build.backgroundUrl && build.backgroundIndex === index
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
    </section>
  )
}
