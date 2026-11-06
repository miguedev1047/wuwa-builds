import { ItemGroup } from "@/components/ui/item"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams, useRouteContext } from "@tanstack/react-router"
import { BuildResonatorSkillItem } from "@/modules/panel/user/builder/components/build-resonator-skill-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BuildResonatorSkills() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { buildId, rosterId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })
  const resonatorId = parseInt(rosterId)

  const { data: build } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, session.session.id))
      )
      .findOne()
  )

  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  const resonatorSkills = new Map(
    resonator.skills.slice(0, 5).map((skill) => [skill.skillId, skill])
  )

  const skills = (build?.resonator.skills ?? []).flatMap((skill) => {
    const resonatorSkill = resonatorSkills.get(skill.skillId)
    return resonatorSkill ? [{ skill, resonatorSkill }] : []
  })

  const handleLevelChange = (skillId: number, id: number, level: number) => {
    buildCollection.update(buildId, (current) => {
      const skillLevels = current.resonator.skills ?? []
      const existing = skillLevels.find((item) => item.skillId === skillId)

      if (existing) {
        existing.level = level
      } else {
        skillLevels.push({ id, skillId, level })
      }

      current.resonator.skills = skillLevels
      current.updateAt = new Date().toISOString()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habilidades</CardTitle>
      </CardHeader>

      <CardContent>
        <ItemGroup>
          {skills.map(({ skill, resonatorSkill }) => (
            <BuildResonatorSkillItem
              key={skill.skillId}
              skill={skill}
              resonatorSkill={resonatorSkill}
              onLevelChange={(level) =>
                handleLevelChange(skill.skillId, skill.id, level)
              }
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
