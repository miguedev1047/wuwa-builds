import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import type { EchoesDataProps } from "@/modules/build/domain/build-record"
import { EchoSotSubstatCard } from "./echo-slot-substat-card"

interface EchoSlotSubstatsProps {
  slot: EchoesDataProps
}

export function EchoSlotSubstats({ slot }: EchoSlotSubstatsProps) {
  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Subestadisticas</BuildWorkspace.Text>
      <div className="grid gap-2">
        {slot.substats.map((substat) => (
          <EchoSotSubstatCard key={substat.index} substat={substat} />
        ))}
      </div>
    </div>
  )
}
