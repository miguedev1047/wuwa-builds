import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import type { BuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { weaponQueries } from "@/modules/encore/queries/catalogs"
import { characterQueries } from "@/modules/encore/queries/characters"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { eq, useLiveQuery } from "@tanstack/react-db"
import { useSuspenseQuery } from "@tanstack/react-query"
import { cn } from "cn"
import { Suspense, useState } from "react"

interface BuildWeaponProps {
  draftId: string
  collection: BuildDraftCollection
}

export function BuildWeapon({ collection, draftId }: BuildWeaponProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  const { data: character } = useSuspenseQuery({
    ...characterQueries.detail(draft?.characterId ?? 0),
  })

  const weaponType = character.weaponType

  const filteredWeaponsByType = weapons.filter(
    (item) => item.typeName === weaponType
  )

  if (!draft) return null

  const selectedWeapon = weapons.find(
    (item) => item.id === draft.payload.weapon.weaponId
  )

  return (
    <Field>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <Show when={!selectedWeapon}>
            <DialogTrigger
              render={
                <button className="group/item flex h-20 w-full items-center justify-center overflow-hidden border-2 border-dashed bg-card/80 transition-all ease-in-out hover:border-blue-500/40">
                  <p className="text-muted-foreground/80 transition-all ease-in-out group-hover/item:text-muted-foreground">
                    Seleccionar arma
                  </p>
                </button>
              }
            />
          </Show>

          <Show when={selectedWeapon}>
            {(weapon) => (
              <div className="w-full">
                <div className="flex w-full items-start gap-2">
                  <DialogTrigger
                    render={
                      <figure
                        role="button"
                        className="size-20 overflow-hidden bg-accent"
                      >
                        <img
                          src={weapon.icon}
                          alt={weapon.name}
                          className="size-full object-cover transition-transform ease-in-out hover:scale-120"
                        />
                      </figure>
                    }
                  />

                  <div className="flex w-full items-center justify-between">
                    <p>{weapon.name}</p>

                    <Button
                      onClick={() => {
                        collection.update(draftId, (current) => {
                          current.payload.weapon.weaponId = null
                        })
                      }}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <HugeiconsIcon icon={DeleteIcon} />
                    </Button>
                  </div>
                </div>

                <Suspense key={weapon.id} fallback={<Spinner />}>
                  <WeaponActions weaponId={weapon.id} />
                </Suspense>
              </div>
            )}
          </Show>
        </div>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Selecciona un arma</DialogTitle>
          </DialogHeader>

          <div className="-mx-auto no-scrollbar h-[40vh] w-full overflow-y-scroll">
            <ul className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {filteredWeaponsByType.map((item) => (
                <li
                  role="button"
                  key={item.id}
                  data-selected={draft.payload.weapon.weaponId === item.id}
                  className={cn(
                    "aspect-square overflow-hidden border border-transparent bg-accent transition-colors ease-in-out",
                    "data-[selected=true]:border-input"
                  )}
                  onClick={() => {
                    collection.update(draftId, (current) => {
                      current.payload.weapon.weaponId = item.id
                    })

                    setIsOpen(false)
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="size-full object-cover transition-transform ease-in-out hover:scale-120"
                  />
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <DialogClose render={<Button>Cerrar</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Field>
  )
}
interface WeaponActionsProps {
  weaponId: number
}

function WeaponActions({ weaponId }: WeaponActionsProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))

  if (!weaponId) return

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: weapon.effect }} />
    </div>
  )
}
