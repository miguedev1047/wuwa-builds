import { useEffect, useId, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import {
  resonatorInput,
  type ResonatorInput,
} from "@game-data/application/schemas"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { createResonator } from "@game-data/server/resonators/resonators"
import { resonatorDraftFromEncore } from "@panel/admin/game-data/views/resonators/shared/application/resonator-draft"
import {
  ResonatorFields,
  resonatorFormDefaults,
} from "@panel/admin/game-data/views/resonators/shared/components/resonator-fields"
import { ResonatorSearch } from "@panel/admin/game-data/views/resonators/shared/components/resonator-search"
import type { EncoreCharacterSummary } from "@encore/domain/character"
import { encoreCharacterQueries } from "@encore/queries/characters"

export function ResonatorForm() {
  const formId = `new-resonator-form-${useId()}`
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<EncoreCharacterSummary | null>(null)

  const { data: encoreCharacter, isLoading: isEncoreLoading } = useQuery({
    ...encoreCharacterQueries.detail(selected?.id ?? 0),
    enabled: selected !== null,
  })

  const { mutateAsync, isPending: isMutationPending } = useMutation({
    mutationFn: (value: ResonatorInput) => createResonator({ data: value }),
    onSuccess: async (resonator) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characters(),
      })
      toast.success("Resonador creado")

      await navigate({
        to: "/admin/resonators/$id",
        params: { id: resonator.id.toString() },
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isPending = isMutationPending || isEncoreLoading

  const form = useAppForm({
    formId,
    defaultValues: resonatorFormDefaults,
    validators: { onSubmit: resonatorInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  useEffect(() => {
    if (!encoreCharacter) return

    form.reset(resonatorDraftFromEncore(encoreCharacter))
  }, [encoreCharacter, form])

  return (
    <CatalogSection.Content>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <ResonatorFields form={form} isPending={isPending} />
      </form>

      <div className="grid w-full grid-cols-2 gap-2">
        <ResonatorSearch
          selectedId={selected?.id}
          onSelect={setSelected}
          disabled={isPending}
        />

        <form.AppForm>
          <form.SubmitButton
            label="Crear"
            formId={formId}
            disabled={isPending || !selected}
          />
        </form.AppForm>
      </div>
    </CatalogSection.Content>
  )
}
