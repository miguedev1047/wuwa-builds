import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemGroup } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { updateBuild } from "@/modules/builds/client/build-store"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { useBuildCollection } from "@/modules/panel/user/builder/application/builder"
import { BuildResonatorSkillItem } from "@/modules/panel/user/builder/components/build-resonator-skill-item"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

export function BuildResonatorSkills() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })
  const resonatorId = build?.resonator.data?.id

  const { data: resonator, isLoading } = useQuery({
    ...characterQueries.detail(resonatorId ?? 0),
    enabled: resonatorId !== undefined,
  })

  const resonatorSkills = new Map(
    (resonator?.skills ?? []).slice(0, 5).map((skill) => [skill.skillId, skill])
  )

  const skills = (build?.resonator.skills ?? []).flatMap((skill) => {
    const resonatorSkill = resonatorSkills.get(skill.skillId)
    return resonatorSkill ? [{ skill, resonatorSkill }] : []
  })

  const handleLevelChange = (skillId: number, id: number, level: number) => {
    updateBuild(buildId, (current) => {
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
        {isLoading ? (
          <Spinner />
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
