import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { SonataAddForm } from "@catalog/presentation/sonatas/components/sonata-add-form"

export function SonataAddAction() {
  return (
    <EditableSection.AddAction
      title="Nuevo set de sonata"
      description="Crea un set manual. Los sets de Encore llegan con la sincronizacion."
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => <SonataAddForm onSaved={close} onCancel={close} />}
    </EditableSection.AddAction>
  )
}
