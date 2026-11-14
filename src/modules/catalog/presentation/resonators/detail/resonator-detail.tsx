import { ResonatorInfoSection } from "@catalog/presentation/resonators/detail/sections/info"
import { ResonatorMediaSection } from "@catalog/presentation/resonators/detail/sections/media"
import { ResonatorSkillsSection } from "@catalog/presentation/resonators/detail/sections/skills"
import { ResonatorSequencesSection } from "@catalog/presentation/resonators/detail/sections/sequences"
import { ResonatorPassivesSection } from "@catalog/presentation/resonators/detail/sections/passives"
import { ResonatorTagsSection } from "@catalog/presentation/resonators/detail/sections/tags"
import { ResonatorLevelsSection } from "@catalog/presentation/resonators/detail/sections/levels"

export function ResonatorDetail({ resonatorId }: { resonatorId: number }) {
  return (
    <div className="space-y-10">
      <ResonatorInfoSection resonatorId={resonatorId} />
      <ResonatorMediaSection resonatorId={resonatorId} />
      <ResonatorSkillsSection resonatorId={resonatorId} />
      <ResonatorSequencesSection resonatorId={resonatorId} />
      <ResonatorPassivesSection resonatorId={resonatorId} />
      <ResonatorTagsSection resonatorId={resonatorId} />
      <ResonatorLevelsSection resonatorId={resonatorId} />
    </div>
  )
}
