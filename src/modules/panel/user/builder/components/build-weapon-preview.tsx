import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import { useParams } from "@tanstack/react-router"
import { useBuildCollection } from "@/modules/panel/user/builder/application/builder"
import { WeaponLevel } from "@/modules/panel/user/builder/components/build-weapon-level"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { BuildWeaponRefinaments } from "@/modules/panel/user/builder/components/build-weapon-refinaments"

export function BuildWeaponPreview() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })

  const buildWeapon = build?.weapon.data

  return (
    <Show when={buildWeapon}>
      {(weapon) => (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <figure className="aspect-square w-64 bg-accent">
              <img src={weapon.icon} />
            </figure>
            <div className="space-y-2">
              <h2 className="font-bold">{weapon.name}</h2>
              <Badge>{weapon.typeName}</Badge>
            </div>
          </div>

          <Suspense fallback={<Spinner />}>
            <WeaponLevel />
          </Suspense>

          <Suspense fallback={<Spinner />}>
            <BuildWeaponRefinaments />
          </Suspense>
        </div>
      )}
    </Show>
  )
}
