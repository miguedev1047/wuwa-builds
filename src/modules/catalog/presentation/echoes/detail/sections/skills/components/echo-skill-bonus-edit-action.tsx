import { Button } from "@/components/panelui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSkillBonusFields } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-bonus-form-fields"
import { useEchoSkillBonusForm } from "@catalog/presentation/echoes/detail/sections/skills/hooks/echo-skill-bonus-form"
import type { EchoSkillBonusRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense, useState } from "react"

type EchoSkillBonusEditActionProps = {
  echoId: number
  bonus: EchoSkillBonusRow
}

export function EchoSkillBonusEditAction({
  echoId,
  bonus,
}: EchoSkillBonusEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, characterOptions, isPending, form, onCancel } =
    useEchoSkillBonusForm({
      echoId: echoId,
      bonus: bonus,
      onSaved: () => setOpen(false),
      onCancel: () => setOpen(false),
    })
  const onOpenChange = (next: boolean) => {
    if (isPending) return
    if (next) form.reset()
    setOpen(next)
  }
  return (
    <EditableSection.Action
      open={open}
      onOpenChange={onOpenChange}
      isPending={isPending}
      footer={
        <>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cerrar
          </Button>

          <form.AppForm>
            <form.SubmitButton
              label={bonus ? "Guardar" : "Agregar"}
              formId={formId}
            />
          </form.AppForm>
        </>
      }
      mode="edit"
      title="Editar bono"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar bono"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </Button>
      }
    >
      {() => (
        <Suspense fallback={<Skeleton className="h-50 w-full" />}>
          <form
            id={formId}
            className="mb-4"
            onSubmit={(event) => {
              event.preventDefault()
              void form.handleSubmit().catch(() => undefined)
            }}
          >
            <EchoSkillBonusFields
              form={form}
              isPending={isPending}
              characterOptions={characterOptions}
            />
          </form>
        </Suspense>
      )}
    </EditableSection.Action>
  )
}
