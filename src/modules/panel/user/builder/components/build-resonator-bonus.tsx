import { ItemGroup } from "@/components/ui/item"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useParams, useRouteContext } from "@tanstack/react-router"
import { BuildResonatorBonusItem } from "@/modules/panel/user/builder/components/build-resonator-bonus-item"
import { BuildResonatorBonusList } from "@/modules/panel/user/builder/components/build-resonator-bonus-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BuildResonatorBonus() {
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

  const passives = build?.resonator.passives ?? []
  const enabledPassives = passives.filter(
    (passive) => passive.type === "passive" && passive.enabled
  )

  const handleEnabledChange = (id: number, enabled: boolean) => {
    buildCollection.update(buildId, (current) => {
      const currentPassives = current.resonator.passives ?? []
      const passive = currentPassives.find((item) => item.id === id)

      if (!passive) return

      passive.enabled = enabled
      current.resonator.passives = currentPassives
      current.updateAt = new Date().toISOString()
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <CardTitle>Pasivas</CardTitle>
          <BuildResonatorBonusList passives={enabledPassives} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <ItemGroup className="grid grid-cols-5 gap-4">
            {passives.map((passive) => (
              <BuildResonatorBonusItem
                key={passive.id}
                passive={passive}
                onEnabledChange={(enabled) =>
                  handleEnabledChange(passive.id, enabled)
                }
              />
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}
