import { Button } from "@/components/panelui/button"
import { FieldGroup } from "@/components/ui/field"

import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useEchoSkillTextForm } from "@catalog/presentation/echoes/detail/sections/skills/hooks/echo-skill-text-form"
import type { EchoSkillRow } from "@db/schema"
import { PencilEdit01Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense, useState } from "react"

type EchoSkillTextActionProps = {
  echoId: number
  skill: EchoSkillRow | null
}

/** Opens the skill text dialog, prefilled from Encore when it is missing. */
export function EchoSkillTextAction({
  echoId,
  skill,
}: EchoSkillTextActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useEchoSkillTextForm({
    echoId: echoId,
    skill: skill,
    onSaved: () => setOpen(false),
    onCancel: () => setOpen(false),
  })
  const onOpenChange = (next: boolean) => {
    if (isPending) return
    if (next) form.reset()
    setOpen(next)
  }

  const body = () => (
    <Suspense fallback={<Skeleton className="h-40 w-full" />}>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit().catch(() => undefined)
        }}
        className="mb-4"
      >
        <FieldGroup className="gap-4">
          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Descripción"
                placeholder="Invoca ..."
                rows={8}
                disabled={isPending}
              />
            )}
          </form.AppField>

          <form.AppField name="simpleDescription">
            {(field) => (
              <field.TextareaField
                label="Descripción corta"
                placeholder="Resumen de la habilidad"
                rows={3}
                disabled={isPending}
              />
            )}
          </form.AppField>

          <form.AppField name="icon">
            {(field) => (
              <field.ImageField
                label="Icono"
                placeholder="https://api-v2.encore.moe/resource/..."
                inputMode="url"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </form>
    </Suspense>
  )

  return (
    <EditableSection.Action
      mode={skill ? "edit" : "default"}
      open={open}
      onOpenChange={onOpenChange}
      isPending={isPending}
      title={skill ? "Editar habilidad" : "Importar habilidad"}
      trigger={
        <Button>
          <HugeiconsIcon icon={skill ? PencilEdit01Icon : PlusIcon} />
          {skill ? "Editar texto" : "Importar de Encore"}
        </Button>
      }
      footer={
        <>
          <Button variant="secondary" disabled={isPending} onClick={onCancel}>
            Cerrar
          </Button>
          <form.AppForm>
            <form.SubmitButton label="Guardar" formId={formId} />
          </form.AppForm>
        </>
      }
    >
      {body}
    </EditableSection.Action>
  )
}
