import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useId, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  resonatorInput,
  type ResonatorInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/modules/panel/admin/game-data/components/form-fields"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createResonator } from "@/modules/panel/admin/game-data/server/characters"
import { resonatorDraftFromEncore } from "@/modules/panel/admin/game-data/views/resonators/application/resonator-draft"
import { ResonatorSearch } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-search"
import {
  RESONATOR_ELEMENTS,
  RESONATOR_RARITY,
  RESONATOR_WEAPON_TYPES,
} from "@/modules/panel/admin/game-data/views/resonators/constants/resonator"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { characterQueries } from "@/modules/encore/queries/characters"

const defaultValues: ResonatorInput = {
  id: 0,
  name: "",
  nickname: "",
  introduction: "",
  rarity: 5,
  element: "",
  weaponType: "",
  icon: "",
  card: "",
  circle: "",
  iconLarge: "",
  portrait: "",
}

export function ResonatorForm() {
  const formId = `new-resonator-form-${useId()}`
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<EncoreCharacterSummary | null>(null)

  // The list endpoint only returns a summary; the detail carries the fields
  // the form needs (nickname, introduction, images).
  const { data: encoreCharacter, isLoading: isEncoreLoading } = useQuery({
    ...characterQueries.detail(selected?.id ?? 0),
    // A disabled query is still `isPending`, so gate the spinner on the fetch
    // and enable it with the selection itself.
    enabled: selected !== null,
  })

  const { mutate, isPending: isMutationPending } = useMutation({
    mutationFn: (value: ResonatorInput) => createResonator({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characters(),
      })
      toast.success("Resonador creado")

      await navigate({ to: "/admin/resonators" })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isPending = isEncoreLoading || isMutationPending

  const form = useForm({
    formId,
    defaultValues,
    validators: { onSubmit: resonatorInput },
    onSubmit: ({ value }) => {
      mutate(value)
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
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="name"
            validators={{ onBlur: resonatorInput.shape.name }}
          >
            {(field) => (
              <TextField
                field={field}
                label="Nombre del resonador"
                placeholder="Cartethyia"
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="nickname"
            validators={{ onBlur: resonatorInput.shape.nickname }}
          >
            {(field) => (
              <TextField
                field={field}
                label="Apodo"
                placeholder="Aero"
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="introduction"
            validators={{ onBlur: resonatorInput.shape.introduction }}
          >
            {(field) => (
              <TextareaField
                field={field}
                label="Introducción"
                placeholder="Descripción del resonador"
                rows={4}
                className="md:col-span-2"
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="rarity"
            validators={{ onSubmit: resonatorInput.shape.rarity }}
          >
            {(field) => (
              <SelectField
                field={field}
                label="Rareza"
                options={RESONATOR_RARITY}
                placeholder="Seleccionar rareza"
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="element"
            validators={{ onSubmit: resonatorInput.shape.element }}
          >
            {(field) => (
              <SelectField
                field={field}
                label="Elemento"
                options={RESONATOR_ELEMENTS}
                placeholder="Seleccionar elemento"
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="weaponType"
            validators={{ onSubmit: resonatorInput.shape.weaponType }}
          >
            {(field) => (
              <SelectField
                field={field}
                label="Tipo de arma"
                options={RESONATOR_WEAPON_TYPES}
                placeholder="Seleccionar tipo de arma"
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="icon"
            validators={{ onBlur: resonatorInput.shape.icon }}
          >
            {(field) => (
              <TextField
                field={field}
                label="Icono"
                placeholder="https://api-v2.encore.moe/resource/..."
                inputMode="url"
                disabled={isPending}
              />
            )}
          </form.Field>
        </FieldGroup>
      </form>

      <div className="grid w-full grid-cols-2 gap-2">
        <ResonatorSearch
          selectedId={selected?.id}
          onSelect={setSelected}
          disabled={isPending}
        />

        <Button size="xl" type="submit" disabled={isPending} form={formId}>
          {isPending && <Spinner />}
          {!isPending && "Crear"}
        </Button>
      </div>
    </CatalogSection.Content>
  )
}
