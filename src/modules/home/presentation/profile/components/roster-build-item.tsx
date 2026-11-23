import { Skeleton } from "@/components/ui/skeleton"
import { Show } from "@/components/utility/show"
import { ReadOnlyBuildCard } from "@build/presentation/components/build-canvas/read-only-build-card"
import type {
  ProfileRosterBuild,
  ProfileRosterCard,
} from "@home/domain/profile-roster"
import { formatRosterDate } from "@home/presentation/profile/helpers/format-roster-date"

type RosterBuildItemProps = {
  /** Name and update date from the roster summary. */
  summary: ProfileRosterBuild
  /** Prepared canvas data for this build, when it can be rendered. */
  card?: ProfileRosterCard
  /** First load of the roster's card data. */
  pending: boolean
  /** The list supplies a shared retry message on request failure. */
  failed: boolean
}

/** Displays a variant and its independently scrollable build card. */
export function RosterBuildItem({
  summary,
  card,
  pending,
  failed,
}: RosterBuildItemProps) {
  const { name, updatedAt } = summary

  return (
    <li className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="min-w-0 font-semibold wrap-anywhere">{name}</h3>
        <time dateTime={updatedAt} className="text-sm text-muted-foreground">
          {formatRosterDate(updatedAt)}
        </time>
      </div>
      <Show
        when={card}
        fallback={
          <Show
            when={pending}
            fallback={
              <Show when={!failed}>
                <p className="text-sm text-muted-foreground">
                  Esta tarjeta no está disponible.
                </p>
              </Show>
            }
          >
            <Skeleton
              className="h-204 w-full"
              aria-label="Cargando tarjeta"
              role="status"
            />
          </Show>
        }
      >
        {({ build, preview }) => (
          <div
            role="region"
            aria-label={`Tarjeta de ${name}`}
            tabIndex={0}
            className="max-w-full overflow-x-auto rounded-4xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ReadOnlyBuildCard build={build} preview={preview} />
          </div>
        )}
      </Show>
    </li>
  )
}
