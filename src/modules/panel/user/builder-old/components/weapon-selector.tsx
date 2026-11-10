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
import { updateBuild } from "@builds/client/build-store"
import type { WeaponSummary } from "@game-data/domain/weapon"
import { weaponQueries } from "@game-data/queries/weapons"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useState } from "react"
import { SkeletonSuspense } from "skullet/react"
import { BuildWeaponPreview } from "@panel/user/builder-old/components/build-weapon-preview"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { cn } from "cn"
import { toast } from "sonner"

export function WeaponSelectorDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })
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
                <WeaponList setIsOpen={setIsOpen} />
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
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void
}) {
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  if (weapons.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay armas en el catálogo.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-4 gap-4">
      {weapons.map((weapon) => (
        <WeaponItem weapon={weapon} setIsOpen={setIsOpen} key={weapon.id} />
      ))}
    </ul>
  )
}

export function WeaponItem({
  weapon,
  setIsOpen,
}: {
  weapon: WeaponSummary
  setIsOpen: (value: boolean) => void
}) {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })
  const { data: build } = useBuildCollection({ buildId })

  const queryClient = useQueryClient()

  const buildWeapon = build?.weapon.data
  const selectedWeapon = buildWeapon?.id === weapon.id

  const handleWeaponSelect = async () => {
    try {
      await queryClient.query(weaponQueries.detail(weapon.id))

      updateBuild(buildId, (current) => {
        current.weapon.data = weapon
        current.updateAt = new Date().toISOString()
      })

      setIsOpen(false)
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
