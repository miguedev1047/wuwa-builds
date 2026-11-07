import { Input } from "@/components/ui/input"
import { Show } from "@/components/utility/show"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useParams, useRouteContext } from "@tanstack/react-router"
import { useState, type ChangeEvent } from "react"
import { BuildResonatorLevel } from "@/modules/panel/user/builder/components/build-resonator-level"
import { BuildResonatorSequence } from "@/modules/panel/user/builder/components/build-resonator-sequence"
import { BuildResonatorSkills } from "@/modules/panel/user/builder/components/build-resonator-skills"
import { BuildResonatorBonus } from "@/modules/panel/user/builder/components/build-resonator-bonus"
import { WeaponSelectorDialog } from "@/modules/panel/user/builder/components/weapon-selector"
import { EchoesSelectorDialog } from "@/modules/panel/user/builder/components/echo-selector"

export function BuilderRoot() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const [isEditing, setIsEditing] = useState(false)

  const { data } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, session.session.id))
      )
      .findOne()
  )

  const handleChangeBuildName = (event: ChangeEvent<HTMLInputElement>) => {
    buildCollection.update(buildId, (draft) => {
      const updated = new Date().toISOString()

      draft.name = event.target.value
      draft.updateAt = updated
    })
  }

  return (
    <Show when={data}>
      {(build) => (
        <div className="space-y-4">
          <Show
            when={isEditing}
            fallback={
              <h2 onDoubleClick={() => setIsEditing(true)}>{build.name}</h2>
            }
          >
            <Input
              value={build.name}
              className="max-w-xs"
              placeholder="Nombre de la build"
              onChange={handleChangeBuildName}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsEditing(false)
                }
                if (event.key === "Enter") {
                  setIsEditing(false)
                }
              }}
            />
          </Show>

          <figure className="h-100 w-60 bg-accent">
            <img
              src={build.resonator.data.portrait}
              alt={build.resonator.data.name}
              className="size-full object-cover"
            />
          </figure>

          <BuildResonatorSequence />
          <BuildResonatorLevel />
          <BuildResonatorSkills />
          <BuildResonatorBonus />

          <WeaponSelectorDialog />
          <EchoesSelectorDialog />
        </div>
      )}
    </Show>
  )
}
