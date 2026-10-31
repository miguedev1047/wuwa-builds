import { createFormHookContexts } from "@tanstack/react-form"

/**
 * Contexts shared by every composed form.
 *
 * Field components read their field with `useFieldContext`, form components
 * read the form with `useFormContext`.
 */
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()
