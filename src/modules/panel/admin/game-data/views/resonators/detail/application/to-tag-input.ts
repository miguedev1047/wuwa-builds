import type { ResonatorTagRow } from "@/db/schema"
import type { EncoreTag } from "@/modules/encore/domain/character"
import type { ResonatorTagInput } from "@/modules/panel/admin/game-data/application/schemas"

export function toTagInput(
  name: string,
  encoreTags: EncoreTag[],
  savedTags: ResonatorTagRow[]
): ResonatorTagInput {
  const encoreTag = encoreTags.find((tag) => tag.name === name)

  if (encoreTag) {
    return {
      name: encoreTag.name,
      description: encoreTag.description,
      color: encoreTag.color,
      icon: encoreTag.icon,
    }
  }

  const savedTag = savedTags.find((tag) => tag.name === name)

  return {
    name,
    description: savedTag?.description ?? "",
    color: savedTag?.color ?? "",
    icon: savedTag?.icon ?? "",
  }
}
