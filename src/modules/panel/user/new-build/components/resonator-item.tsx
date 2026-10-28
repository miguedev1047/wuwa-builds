import { Show } from "@/components/utility/show"
import type { ResonatorIndexEntry } from "@/modules/wuwa/domain/resonator"
import { getResonator } from "@/modules/wuwa/server/resonators"
import { toast } from "sonner"

interface ResonatorItemProps {
  resonator: ResonatorIndexEntry
}

export function ResonatorItem({ resonator }: ResonatorItemProps) {
  const handleNewBuild = async () => {
    try {
      if (resonator) {
        const genBuildId = crypto.randomUUID()

        const resonatorData = await getResonator({
          data: { slug: resonator.slug },
        })

        console.log(resonatorData)
        console.log(genBuildId)
      }
    } catch (err) {
      console.error(err)
      toast.error("Ha ocurrido un error al obtener el resonador")
    }
  }

  return (
    <li
      onClick={handleNewBuild}
      role="button"
      className="aspect-2/3 overflow-hidden"
    >
      <Show when={resonator.cardImage}>
        {(image) => (
          <img
            className="size-full object-cover transition-transform ease-in-out hover:scale-120"
            src={image}
          />
        )}
      </Show>
    </li>
  )
}
