import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import { Button } from "@/components/panelui/button"
import { Dialog } from "@/components/panelui/dialog"
import { Input } from "@/components/panelui/input"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Show } from "@/components/utility/show"
import { ImageIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSelector } from "@tanstack/react-form"
import { useState, type ComponentProps, type ReactNode } from "react"

type ImageFieldProps = {
  label: ReactNode
  description?: ReactNode
  className?: string
  /** Opens a nested image preview using only a URL accepted by the caller. */
  dialogPreview?: {
    title: string
    getUrl: (value: string) => string | null
  }
} & Omit<ComponentProps<typeof Input>, "value" | "onChange" | "name" | "id">

/** URL input with a preview action in its trailing addon. */
export function ImageField({
  label,
  description,
  className,
  dialogPreview,
  ...props
}: ImageFieldProps) {
  const field = useFieldContext<string>()
  const value = useSelector(field.store, (state) => state.value)
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <Input.Group>
        <Input
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          autoComplete="off"
          {...props}
        />
        <Input.Addon align="end">
          <Show
            when={dialogPreview}
            fallback={
              <Popover>
                <PopoverTrigger
                  render={previewButton("Previsualizar imagen", !value)}
                />
                <PopoverContent className="size-40 p-4">
                  <img
                    src={value}
                    alt="Vista previa"
                    className="size-full object-cover"
                  />
                </PopoverContent>
              </Popover>
            }
          >
            {({ title, getUrl }) => {
              const src = getUrl(value ?? "")
              return (
                <Dialog>
                  <Dialog.Trigger
                    render={previewButton(title, !src || props.disabled)}
                  />
                  <Dialog.Content size="lg" showClose={false}>
                    <Dialog.Header title={title} />
                    <Dialog.Body>
                      <Show when={src}>
                        {(url) => <PreviewImage key={url} src={url} />}
                      </Show>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.Close
                        render={<Button variant="secondary">Cerrar</Button>}
                      />
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog>
              )
            }}
          </Show>
        </Input.Addon>
      </Input.Group>
    </FieldShell>
  )
}

function previewButton(label: string, disabled?: boolean) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={label}
      disabled={disabled}
    >
      <HugeiconsIcon icon={ImageIcon} />
    </Button>
  )
}

function PreviewImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <Show
      when={!failed}
      fallback={
        <Empty className="w-full border border-dashed" role="status">
          <EmptyTitle className="text-xs text-muted-foreground">
            No se pudo cargar la imagen. Comprueba el enlace directo.
          </EmptyTitle>
        </Empty>
      }
    >
      <img
        src={src}
        alt="Vista previa de la imagen"
        referrerPolicy="no-referrer"
        className="h-auto w-full rounded-lg object-contain"
        onError={() => setFailed(true)}
      />
    </Show>
  )
}
