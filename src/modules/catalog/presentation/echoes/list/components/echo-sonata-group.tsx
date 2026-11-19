import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Show } from "@/components/utility/show"
import { EchoListItem } from "@catalog/presentation/echoes/list/components/echo-list-item"
import type { EchoSonataGroup } from "@catalog/presentation/echoes/list/application/group-echoes-by-sonata"

type EchoSonataGroupSectionProps = {
  group: EchoSonataGroup
}

/** One sonata group of the echo list, with its header and grid of echoes. */
export function EchoSonataGroupSection({ group }: EchoSonataGroupSectionProps) {
  const count =
    group.echoes.length === 1 ? "1 eco" : `${group.echoes.length} ecos`

  return (
    <section data-slot="echo-sonata-group" className="space-y-4">
      <header className="flex items-center gap-3 border-b border-border/60 pb-3">
        <Show when={group.icon}>
          {(icon) => (
            <img
              src={icon}
              alt=""
              className="size-10 shrink-0 rounded-md bg-muted object-contain p-1"
            />
          )}
        </Show>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h2 className="truncate font-heading text-base font-bold">
              {group.name}
            </h2>
            <span className="text-xs text-muted-foreground">{count}</span>
          </div>
        </div>
      </header>

      <RouteNavigation.List
        items={group.echoes}
        cols={6}
        aspect="square"
        getKey={(echo) => echo.id}
      >
        {(echo) => <EchoListItem echo={echo} />}
      </RouteNavigation.List>
    </section>
  )
}
