import type { EchoesDataProps } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type { EchoSummary } from "@/modules/game-data/domain/echo"

interface SelectEchoSlotInput {
  echoes: EchoesDataProps[]
  targetIndex: number
  echo: EchoSummary
}

/**
 * Assigns an echo to a slot.
 *
 * If the echo already belongs to another slot, both slots are swapped so the
 * same echo is never selected twice.
 */
export function selectEchoSlot({
  echoes,
  targetIndex,
  echo,
}: SelectEchoSlotInput): EchoesDataProps[] {
  const target = echoes[targetIndex]

  if (!target) return echoes

  const sourceIndex = echoes.findIndex(
    (slot) => slot.index !== targetIndex && slot.data?.id === echo.id
  )

  if (sourceIndex === -1) {
    if (target.data?.id === echo.id) return echoes

    const next = [...echoes]

    next[targetIndex] = {
      ...target,
      index: targetIndex,
      data: echo,
      cost: echo.cost,
      mainStatLabel: "",
      mainStatValue: 0,
      substats: (target.substats ?? []).map((substat) => ({
        ...substat,
        valueLabel: "",
        valueNumber: 0,
      })),
    }

    return next
  }

  const next = [...echoes]
  const source = next[sourceIndex]

  next[sourceIndex] = { ...target, index: sourceIndex }
  next[targetIndex] = { ...source, index: targetIndex }

  return next
}
