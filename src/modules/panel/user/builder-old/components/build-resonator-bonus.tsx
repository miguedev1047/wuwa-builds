import { ItemGroup } from "@/components/ui/item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateBuild } from "@builds/client/build-store"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { BuildResonatorBonusItem } from "@panel/user/builder-old/components/build-resonator-bonus-item"
import { BuildResonatorBonusList } from "@panel/user/builder-old/components/build-resonator-bonus-list"
import { useParams } from "@tanstack/react-router"

export function BuildResonatorBonus() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })

  const passives = build?.resonator.passives ?? []
  const enabledPassives = passives.filter(
    (passive) => passive.type === "passive" && passive.enabled
  )

  const handleEnabledChange = (id: number, enabled: boolean) => {
    updateBuild(buildId, (current) => {
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
