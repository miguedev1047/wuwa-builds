import { useEffect, useId, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import {
  echoInput,
  type EchoInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createEcho } from "@/modules/panel/admin/game-data/server/echoes/echoes"
import { echoDraftFromEncore } from "@/modules/panel/admin/game-data/views/echoes/shared/application/echo-draft"
import {
  EchoFields,
  echoFormDefaults,
} from "@/modules/panel/admin/game-data/views/echoes/shared/components/echo-fields"
import { EchoSearch } from "@/modules/panel/admin/game-data/views/echoes/shared/components/echo-search"
import type { EncoreEchoSummary } from "@/modules/encore/domain/echo"
import { encoreEchoQueries } from "@/modules/encore/queries/catalogs"

export function EchoForm() {
  const formId = `new-echo-form-${useId()}`
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<EncoreEchoSummary | null>(null)

  const { data: encoreEcho, isLoading: isEncoreLoading } = useQuery({
    ...encoreEchoQueries.detail(selected?.id ?? 0),
    enabled: selected !== null,
  })

  const { mutateAsync, isPending: isMutationPending } = useMutation({
    mutationFn: (value: EchoInput) => createEcho({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echoes(),
      })
      toast.success("Eco creado")

      await navigate({ to: "/admin/echoes" })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isPending = isMutationPending || isEncoreLoading

  const form = useAppForm({
    formId,
    defaultValues: echoFormDefaults,
    validators: { onSubmit: echoInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  useEffect(() => {
    if (!encoreEcho) return

    form.reset(echoDraftFromEncore(encoreEcho))
  }, [encoreEcho, form])

  return (
    <CatalogSection.Content>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <EchoFields form={form} isPending={isPending} />
      </form>

      <div className="grid w-full grid-cols-2 gap-2">
        <EchoSearch
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
