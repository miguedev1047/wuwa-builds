import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./form-context"
import { MultiComboboxField } from "./fields/multi-combobox-field"
import { NumberField } from "./fields/number-field"
import { SelectField } from "./fields/select-field"
import { TextField } from "./fields/text-field"
import { ImageField } from "./fields/image-field"
import { TextareaField } from "./fields/textarea-field"
import { SubmitButton } from "./submit-button"

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
      SelectField,
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
} from "./form-context"

export { FieldShell } from "./field-shell"
export type { FormOption } from "./fields/select-field"
export type { MultiComboboxOption } from "./fields/multi-combobox-field"
