import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "@/components/form/form-context"
import { ComboboxField } from "@/components/form/fields/combobox-field"
import { MultiComboboxField } from "@/components/form/fields/multi-combobox-field"
import { NumberField } from "@/components/form/fields/number-field"
import { SelectField } from "@/components/form/fields/select-field"
import { SwitchField } from "@/components/form/fields/switch-field"
import { TextField } from "@/components/form/fields/text-field"
import { ImageField } from "@/components/form/fields/image-field"
import { TextareaField } from "@/components/form/fields/textarea-field"
import { SubmitButton } from "@/components/form/submit-button"

/**
 * App-wide form toolkit.
 *
 * `useAppForm` is a `useForm` with the shared field and form components
 * pre-bound, and `withForm` lets a piece of a form receive `form` by props:
 *
 * ```tsx
 * const form = useAppForm({ defaultValues, onSubmit })
 * <form.AppField name="name">{(field) => <field.TextField label="Name" />}</form.AppField>
 * ```
 */
export const { useAppForm, withForm, withFieldGroup, extendForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      TextField,
      TextareaField,
      NumberField,
      MultiComboboxField,
      ComboboxField,
      SelectField,
      SwitchField,
      ImageField,
    },
    formComponents: {
      SubmitButton,
    },
  })

export {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} from "@/components/form/form-context"

export { FieldShell } from "@/components/form/field-shell"
export type { FormOption } from "@/components/form/fields/select-field"
export type { MultiComboboxOption } from "@/components/form/fields/multi-combobox-field"
