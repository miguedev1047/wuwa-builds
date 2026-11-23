import { withForm } from "@/components/form"
import { Separator } from "@/components/ui/separator"
import {
  profileFieldSchemas,
  profileFormDefaults,
  profileImageFields,
  profileServerOptions,
} from "@home/presentation/profile/constants/profile-form-fields"
import { getProfileImagePreviewUrl } from "@home/presentation/profile/helpers/profile-form-values"

/** Renders the profile fields using the editing dialog's form instance. */
export const ProfileFields = withForm({
  defaultValues: profileFormDefaults,
  render: function Render({ form }) {
    return (
      <form
        id={form.formId}
        method="post"
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.state.isSubmitting) void form.handleSubmit()
        }}
      >
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(pending) => (
            <fieldset
              disabled={pending}
              className="flex min-w-0 flex-col gap-4"
            >
              <form.AppField name="isPublic">
                {(field) => (
                  <field.SwitchField
                    label="Perfil público"
                    description="Cualquiera con el enlace puede ver tu perfil y tus builds, incluso sin iniciar sesión."
                    disabled={pending}
                  />
                )}
              </form.AppField>
              <form.AppField name="gameName">
                {(field) => <field.TextField label="Nombre en el juego" />}
              </form.AppField>
              <form.AppField
                name="gameUid"
                validators={{ onChange: profileFieldSchemas.gameUid }}
              >
                {(field) => <field.TextField label="UID" inputMode="numeric" />}
              </form.AppField>
              <form.AppField
                name="gameServer"
                validators={{ onSubmit: profileFieldSchemas.gameServer }}
              >
                {(field) => (
                  <field.SelectField
                    label="Servidor"
                    options={profileServerOptions}
                    placeholder="Sin servidor"
                    disabled={pending}
                  />
                )}
              </form.AppField>
              <Separator />
              <div>
                <h3 className="text-base font-medium">Imágenes del perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Pega un enlace directo de Pinterest, Alpha Coders o Wallhaven.
                </p>
              </div>
              {profileImageFields.map(({ name, label, title }) => (
                <form.AppField
                  key={name}
                  name={name}
                  validators={{ onChange: profileFieldSchemas[name] }}
                >
                  {(field) => (
                    <field.ImageField
                      label={label}
                      inputMode="url"
                      placeholder="https://"
                      dialogPreview={{
                        title,
                        getUrl: getProfileImagePreviewUrl,
                      }}
                      disabled={pending}
                    />
                  )}
                </form.AppField>
              ))}
            </fieldset>
          )}
        </form.Subscribe>
      </form>
    )
  },
})
