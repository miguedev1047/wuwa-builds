import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  useBuildDraftCollection,
  type BuildDraftCollection,
} from "@/modules/builds/client/build-drafts-provider"
import { eq } from "@tanstack/db"
import { useLiveQuery } from "@tanstack/react-db"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/builder/$draftId")({
  component: RouteComponent,
  ssr: false,
  // loader: async ({ context }) => {},
})

function RouteComponent() {
  const { draftId } = Route.useParams()
  const collection = useBuildDraftCollection()

  if (!collection) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  return <Builder draftId={draftId} collection={collection} />
}

function Builder({
  draftId,
  collection,
}: {
  draftId: string
  collection: BuildDraftCollection
}) {
  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  const handleRemoveLocalBuild = () => {
    collection.delete(draftId)
  }

  if (!draft) {
    return (
      <div className="space-y-4">
        <Button
          nativeButton={false}
          render={<Link to="/panel/my-builds">Volver</Link>}
        />
        <h1>Builder</h1>
        <p>No se encontró el borrador.</p>
        <Link to="/panel/new-build">Volver a elegir personaje</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleRemoveLocalBuild}
        nativeButton={false}
        render={<Link to="/panel/my-builds">Volver</Link>}
      />

      <h1>Builder</h1>
      <p>Personaje: {draft.characterId}</p>

      <Field className="flex flex-col gap-1">
        <FieldLabel htmlFor="build-name">Nombre</FieldLabel>
        <Input
          id="build-name"
          value={draft.name}
          onChange={(event) => {
            const name = event.target.value

            collection.update(draftId, (current) => {
              current.name = name
              current.updatedAt = new Date().toISOString()
            })
          }}
        />
      </Field>

      <p className="text-sm opacity-70">
        Borrador local listo. Los campos de <code>draft.payload</code> se editan
        desde aquí.
      </p>
    </div>
  )
}
