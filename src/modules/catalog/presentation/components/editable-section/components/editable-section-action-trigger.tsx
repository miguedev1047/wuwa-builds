import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import type { EditableSectionActionProps } from "@/modules/catalog/presentation/components/editable-section/types"
import {
  DeleteIcon,
  PencilEdit01Icon,
  PlusIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"
import { cloneElement, type ComponentProps, type ReactElement } from "react"

/** Builds the actual button so overlay primitives can merge their trigger props. */
export function actionTrigger(props: EditableSectionActionProps): ReactElement {
  const mode = props.mode ?? "default"
  const label =
    props.label ??
    { default: "Agregar", edit: "Editar", destructive: "Eliminar" }[mode]
  const disabled =
    props.disabled || props.isPending || props.buttonProps?.disabled
  if (props.trigger) {
    const trigger = props.trigger as ReactElement<ComponentProps<typeof Button>>
    return cloneElement(trigger, {
      ...props.buttonProps,
      disabled: disabled || trigger.props.disabled,
      "aria-label": trigger.props["aria-label"] ?? props["aria-label"] ?? label,
      "aria-busy": props.isPending || props["aria-busy"],
      ...(props.onClick ? { onClick: props.onClick } : {}),
    })
  }
  return (
    <Button
      {...props.buttonProps}
      type={props.type ?? "button"}
      variant={mode === "default" ? "secondary" : "ghost"}
      size={props.size ?? (mode === "default" ? "sm" : "icon")}
      className={cn(
        mode === "destructive" && "text-destructive hover:bg-destructive/10",
        props.className,
        props.buttonProps?.className
      )}
      aria-label={props["aria-label"] ?? label}
      disabled={disabled}
      loading={props.isPending}
      onClick={props.onClick}
    >
      <Show
        when={typeof props.children !== "function" && props.children}
        fallback={
          <>
            {props.icon ?? (
              <HugeiconsIcon
                icon={
                  {
                    default: PlusIcon,
                    edit: PencilEdit01Icon,
                    destructive: DeleteIcon,
                  }[mode]
                }
              />
            )}
            <Show when={mode === "default"}>{label}</Show>
          </>
        }
      >
        {(children) => children}
      </Show>
    </Button>
  )
}
