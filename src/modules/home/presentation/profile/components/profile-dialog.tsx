import { useAppForm } from "@/components/form"
import { Button } from "@/components/panelui/button"
import { Dialog } from "@/components/panelui/dialog"
import { useToast } from "@/components/panelui/toast"
import {
  profileUpdateInput,
  type ProfileUpdateInput,
} from "@home/application/profile/profile-update"
import type { ProfileView } from "@home/domain/profile"
import { ProfileFields } from "@home/presentation/profile/components/profile-fields"
import { getProfileFormValues } from "@home/presentation/profile/helpers/profile-form-values"
import { updateProfile } from "@home/server/profile/update-profile"
import { SettingsIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation } from "@tanstack/react-query"
import { useId, useState } from "react"
import { flushSync } from "react-dom"

interface ProfileDialogProps {
  /** Saved values used to start each edit. */
  profile: ProfileView
  /** Refreshes the profile data after the write succeeds. */
  onSaved: () => Promise<void>
}

/** Lets the owner update their profile and its visibility. */
export function ProfileDialog({ profile, onSaved }: ProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const formId = `profile-form-${useId()}`

  const defaultValues = getProfileFormValues(profile)

  const { mutateAsync } = useMutation({
    mutationFn: (value: ProfileUpdateInput) => updateProfile({ data: value }),
    onSuccess: () => {
      flushSync(() => setOpen(false))
      toast.add({ title: "Perfil actualizado", type: "success" })
    },
    onError: () => {
      toast.add({
        title: "No se pudo guardar el perfil",
        description: "Inténtalo de nuevo.",
        type: "destructive",
      })
    },
    onSettled: async (_, error) => {
      if (error) return

      try {
        await onSaved()
      } catch {
        toast.add({
          title: "El perfil se guardó",
          description: "Recarga la página para ver los cambios.",
          type: "warning",
        })
      }
    },
  })

  const form = useAppForm({
    formId,
    defaultValues,
    validators: { onSubmit: profileUpdateInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value).catch(() => undefined)
    },
  })

  if (!profile.isYou) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (form.state.isSubmitting) return
        if (next) form.reset(defaultValues)
        setOpen(next)
      }}
    >
      <Dialog.Trigger
        render={
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Editar perfil"
          >
            <HugeiconsIcon icon={SettingsIcon} />
          </Button>
        }
      />
      <Dialog.Content size="lg">
        <Dialog.Header title="Editar perfil" />
        <Dialog.Body>
          <ProfileFields form={form} />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close
            render={<Button variant="secondary">Cancelar</Button>}
          />
          <form.AppForm>
            <form.SubmitButton formId={formId} label="Guardar cambios" />
          </form.AppForm>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
