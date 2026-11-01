import { useId } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import type { ResonatorTagRow } from "@/db/schema"
import { useAppForm } from "@/components/form"
import type { EncoreTag } from "@/modules/encore/domain/character"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import {
  resonatorTagsSelectionInput,
  type ResonatorTagInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { resonatorTagsQueries } from "@/modules/panel/admin/game-data/queries/tags"
import { replaceResonatorTags } from "@/modules/panel/admin/game-data/server/tags"

export function ResonatorTagsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)
  const enabled = Number.isInteger(resonatorId) && resonatorId > 0

  const { data: savedTags } = useQuery({
    ...resonatorTagsQueries.byResonator(resonatorId),
    enabled,
  })

  const { data: encoreCharacter } = useQuery({
    ...encoreCharacterQueries.detail(resonatorId),
    enabled,
  })

  if (!savedTags || !encoreCharacter) {
    return null
  }

  return (
    <ResonatorTagsForm
      resonatorId={resonatorId}
      savedTags={savedTags}
      encoreTags={encoreCharacter.tags}
    />
  )
}

type ResonatorTagsFormProps = {
  resonatorId: number
  savedTags: ResonatorTagRow[]
  encoreTags: EncoreTag[]
}

function ResonatorTagsForm({
  resonatorId,
  savedTags,
  encoreTags,
}: ResonatorTagsFormProps) {
  const formId = `resonator-tags-form-${useId()}`
  const queryClient = useQueryClient()

  const options = encoreTags.map((tag) => ({
    label: tag.name,
    value: tag.name,
  }))

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (names: string[]) =>
      replaceResonatorTags({
        data: {
          resonatorId,
          tags: names.map((name) => toTagInput(name, encoreTags, savedTags)),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characterTags(resonatorId),
      })
      toast.success("Etiquetas guardadas")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { tags: savedTags.map((tag) => tag.name) },
    validators: { onSubmit: resonatorTagsSelectionInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value.tags)
    },
  })

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Etiquetas</EditableSection.Title>
        <EditableSection.Description>
          Se reemplazan al guardar; las opciones vienen del detalle de Encore.
        </EditableSection.Description>

        <EditableSection.Action>
          <form.AppForm>
            <form.SubmitButton label="Guardar" formId={formId} size="sm" />
          </form.AppForm>
        </EditableSection.Action>
      </EditableSection.Header>

      <EditableSection.Content>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField
            name="tags"
            validators={{ onSubmit: resonatorTagsSelectionInput.shape.tags }}
          >
            {(field) => (
              <field.MultiComboboxField
                label="Etiquetas de rol"
                description="Opciones tomadas del detalle de Encore del resonador."
                options={options}
                placeholder="Agregar etiqueta"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}

function toTagInput(
  name: string,
  encoreTags: EncoreTag[],
  savedTags: ResonatorTagRow[]
): ResonatorTagInput {
  const encoreTag = encoreTags.find((tag) => tag.name === name)

  if (encoreTag) {
    return {
      name: encoreTag.name,
      description: encoreTag.description,
      color: encoreTag.color,
      icon: encoreTag.icon,
    }
  }

  const savedTag = savedTags.find((tag) => tag.name === name)

  return {
    name,
    description: savedTag?.description ?? "",
    color: savedTag?.color ?? "",
    icon: savedTag?.icon ?? "",
  }
}
