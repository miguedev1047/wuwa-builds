import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Show } from "@/components/utility/show"
import {
  createEmptyResonator,
  createEmptyWeapon,
} from "@builds/application/factories/build"
import { updateBuild } from "@builds/client/build-store"
import type { BuildProps } from "@builds/domain/build-record"
import { BuildResonatorBonus } from "@panel/user/builder-old/components/build-resonator-bonus"
import { BuildResonatorLevel } from "@panel/user/builder-old/components/build-resonator-level"
import { BuildResonatorSelector } from "@panel/user/builder-old/components/build-resonator-selector"
import { BuildResonatorSequence } from "@panel/user/builder-old/components/build-resonator-sequence"
import { BuildResonatorSkills } from "@panel/user/builder-old/components/build-resonator-skills"
import { BuildStats } from "@panel/user/builder-old/components/build-stats"
import { EchoesSelectorDialog } from "@panel/user/builder-old/components/echo-selector"
import { WeaponSelectorDialog } from "@panel/user/builder-old/components/weapon-selector"
import { useState, type ChangeEvent } from "react"

interface BuilderRootProps {
  build: BuildProps
}

export function BuilderRoot({ build }: BuilderRootProps) {
  const [isEditing, setIsEditing] = useState(false)
  const buildId = build.buildId

  const handleChangeBuildName = (event: ChangeEvent<HTMLInputElement>) => {
    updateBuild(buildId, (draft) => {
      draft.name = event.target.value
      draft.updateAt = new Date().toISOString()
    })
  }

  const handleRemoveResonator = () => {
    updateBuild(buildId, (draft) => {
      draft.resonator = createEmptyResonator()
      draft.weapon = createEmptyWeapon()
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
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

      <Show
        when={build.resonator.data}
        fallback={
          <div className="space-y-3 rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Esta build no tiene un resonador seleccionado.
            </p>
            <BuildResonatorSelector buildId={buildId} />
          </div>
        }
      >
        {(resonator) => (
          <>
            <div className="flex items-start gap-4">
              <figure className="h-100 w-60 bg-accent">
                <img
                  src={resonator.portrait}
                  alt={resonator.name}
                  className="size-full object-cover"
                />
              </figure>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">{resonator.name}</h3>

                <div className="flex flex-wrap gap-2">
                  <BuildResonatorSelector
                    buildId={buildId}
                    currentResonatorId={resonator.id}
                  />
                  <Button variant="outline" onClick={handleRemoveResonator}>
                    Quitar resonador
                  </Button>
                </div>
              </div>
            </div>

            <BuildResonatorSequence />
            <BuildResonatorLevel />
            <BuildResonatorSkills />
            <BuildResonatorBonus />

            <WeaponSelectorDialog />
            <EchoesSelectorDialog />

            <BuildStats buildId={buildId} element={resonator.element} />
          </>
        )}
      </Show>
    </div>
  )
}
