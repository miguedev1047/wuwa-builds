import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type { WeaponSummary } from "@/modules/game-data/domain/weapon"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useParams, useRouteContext } from "@tanstack/react-router"
import { useState } from "react"
import { SkeletonSuspense } from "skullet/react"
import { BuildWeaponPreview } from "@/modules/panel/user/builder/components/build-weapon-preview"
import { useBuildCollection } from "@/modules/panel/user/builder/application/builder"
import { cn } from "cn"
import { toast } from "sonner"

export function WeaponSelectorDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const { data: build } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, session.session.id))
      )
      .findOne()
  )

  const buildWeapon = build?.weapon.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arma</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button size="xl" className="w-full">
                  Seleccionar arma
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Elige un arma</DialogTitle>
              </DialogHeader>

              <SkeletonSuspense>
                <WeaponList setIsOpen={setIsOpen} isOpen={isOpen} />
              </SkeletonSuspense>
            </DialogContent>
          </Dialog>

          <Show when={buildWeapon}>
            <BuildWeaponPreview />
          </Show>
        </div>
      </CardContent>
    </Card>
  )
}

export function WeaponList({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}) {
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  return (
    <ul className="grid grid-cols-4 gap-4">
      {weapons.map((weapon) => (
        <WeaponItem
          weapon={weapon}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          key={weapon.id}
        />
      ))}
    </ul>
  )
}

export function WeaponItem({
  weapon,
  isOpen,
  setIsOpen,
}: {
  weapon: WeaponSummary
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}) {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })
  const { data: build } = useBuildCollection({ buildId })

  const queryClient = useQueryClient()

  const buildWeapon = build?.weapon.data
  const selectedWeapon = buildWeapon?.id === weapon.id

  const handleWeaponSelect = async () => {
    setIsOpen(!isOpen)

    try {
      await queryClient.query(weaponQueries.detail(weapon.id))

      buildCollection.update(buildId, (current) => {
        const updated = new Date().toISOString()

        current.weapon.data = weapon
        current.updateAt = updated
      })
    } catch {
      toast.error("Ha ocurrido un error al seleccionar el arma")
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <figure
            key={weapon.id}
            role="button"
            onClick={handleWeaponSelect}
            data-selected={selectedWeapon}
            className={cn(
              "aspect-square bg-accent",
              "data-[selected=true]:outline-2"
            )}
          >
            <img
              src={weapon.icon}
              alt={weapon.name}
              className="size-full object-cover"
            />
          </figure>
        }
      />
      <TooltipContent>{weapon.name}</TooltipContent>
    </Tooltip>
  )
}
