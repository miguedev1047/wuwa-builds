import { useForm } from "@tanstack/react-form"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { Button } from "@/components/ui/button"
import { useId } from "react"
import { resonatorPageDockActions } from "@/modules/panel/admin/game-data/views/resonators/helpers/dock-actions.tsx"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "@/components/ui/spinner"

export function ResonatorNewPage() {
  const id = useId
  const formId = `new-resonator-form-${id}`

  const { mutate, isPending } = useMutation({})

  const form = useForm({
    formId,
    defaultValues: {},
    validators: {},
    onSubmit: () => {
      mutate()
    },
  })

  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nuevo resonador</CatalogSection.Title>
      </CatalogSection.Header>

      <CatalogSection.Content>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        ></form>
        <Button
          size="xl"
          type="submit"
          disabled={isPending}
          form={formId}
          className="w-full"
        >
          {isPending && <Spinner />}
          {isPending ? "Cargando..." : "Crear"}
        </Button>
      </CatalogSection.Content>

      <CatalogSection.DockActions items={resonatorPageDockActions} />
    </CatalogSection.Root>
  )
}
