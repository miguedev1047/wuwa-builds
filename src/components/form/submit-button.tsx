import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useFormContext } from "@/components/form/form-context"
import type { ComponentProps } from "react"

type SubmitButtonProps = {
  label: string
  /** Links the button to the `<form>` element it submits. */
  formId: string
  pendingLabel?: string
  className?: string
  size?: ComponentProps<typeof Button>["size"]
  /** Keeps the button disabled even when the form is idle. */
  disabled?: boolean
}

/** Submits its form and disables itself while the form is submitting. */
export function SubmitButton({
  label,
  formId,
  pendingLabel = "Guardando...",
  className,
  size = "xl",
  disabled = false,
}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          size={size}
          type="submit"
          form={formId}
          disabled={isSubmitting || disabled}
          className={className}
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? pendingLabel : label}
        </Button>
      )}
    </form.Subscribe>
  )
}
