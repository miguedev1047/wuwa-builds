import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { resonatorDraftFromEncore } from "@catalog/application/resonators/resonator-draft"
import {
  resonatorInput,
  resonatorFormInput,
  type ResonatorInput,
} from "@catalog/application/schemas"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import {
  ResonatorFields,
  resonatorFormDefaults,
} from "@catalog/presentation/resonators/shared/components/resonator-fields"
import { ResonatorAdminSearch } from "@catalog/presentation/resonators/new/search"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonator } from "@catalog/server/resonators/resonators"
import type { EncoreCharacterSummary } from "@encore/domain/character"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useId, useState } from "react"

export function ResonatorForm() {
  const toast = useToast()

  const formId = `new-resonator-form-${useId()}`
  const { onCreated } = useCatalogActions()
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
      toast.add({ title: "Resonador creado", type: "success" })

      await onCreated(resonator.id)
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const isPending = isMutationPending || isEncoreLoading

  const form = useAppForm({
    formId,
    defaultValues: resonatorFormDefaults,
    validators: { onSubmit: resonatorFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(resonatorInput.parse(value))
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
        <ResonatorAdminSearch
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
