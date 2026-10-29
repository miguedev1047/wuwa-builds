import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import {
  useBuildDraftCollection,
  type BuildDraftCollection,
} from "@/modules/builds/client/build-drafts-provider"
import { characterQueries } from "@/modules/encore/queries/characters"
import { echoQueries, weaponQueries } from "@/modules/encore/queries/catalogs"
import { eq } from "@tanstack/db"
import { useLiveQuery } from "@tanstack/react-db"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { BuildName } from "@/modules/panel/user/builder/components/build-name"
import { BuildResonatorSequence } from "@/modules/panel/user/builder/components/build-resonator-sequence"
import { BuildResonatorLevel } from "@/modules/panel/user/builder/components/build-resonator-level"
import { BuildResonatorSkills } from "@/modules/panel/user/builder/components/build-resonator-skills"
import { Spinner } from "@/components/ui/spinner"
import { BuildWeapon } from "@/modules/panel/user/builder/components/build-weapon"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/panel/builder/$draftId")({
  component: RouteComponent,
  ssr: false,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(characterQueries.list()),
      context.queryClient.query(weaponQueries.list()),
      context.queryClient.query(echoQueries.list()),
    ])
  },
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

  const characterId = draft?.characterId

  const { data: character, isError } = useQuery({
    ...characterQueries.detail(characterId ?? 0),
    enabled: characterId !== undefined,
  })

  if (!draft || isError) {
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
        nativeButton={false}
        render={<Link to="/panel/my-builds">Volver</Link>}
      />

      <h1>Builder</h1>
      <p>Personaje: {character?.name}</p>

      <div className="space-y-8">
        <FieldGroup>
          <BuildName collection={collection} draftId={draftId} />
          <BuildResonatorSequence collection={collection} draftId={draftId} />
          <BuildResonatorLevel collection={collection} draftId={draftId} />
          <BuildResonatorSkills collection={collection} draftId={draftId} />
        </FieldGroup>

        <FieldGroup>
          <Suspense fallback={<Spinner />}>
            <BuildWeapon collection={collection} draftId={draftId} />
          </Suspense>
        </FieldGroup>
      </div>
    </div>
  )
}
