import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { EchoSummary } from "@catalog/domain/echo"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"
import type { ComponentProps } from "react"

type EchoSlotSearchTriggerProps = ComponentProps<"button"> & {
  /** Echo currently equipped in the slot. */
  echo: EchoSummary | null
}

/** Keeps the same focusable dialog trigger for empty and equipped slots. */
export function EchoSlotSearchTrigger({
  echo,
  className,
  ...props
}: EchoSlotSearchTriggerProps) {
  return (
    <button
      type="button"
      aria-label={echo ? "Cambiar eco" : "Selecciona un eco"}
      className={cn(
        "group/image relative cursor-pointer overflow-hidden",
        echo
          ? "shrink-0 rounded-lg"
          : "grid h-90 w-full place-items-center rounded-2xl border border-dashed p-12 text-center text-muted-foreground transition-colors hover:border-brand-accent hover:text-brand-accent",
        className
      )}
      {...props}
    >
      <Show
        when={echo}
        fallback={
          <span className="font-heading text-lg font-medium tracking-tight">
            Selecciona un eco
          </span>
        }
      >
        {(equipped) => (
          <>
            <Image src={equipped.icon} alt="" background="accent" />
            <span className="absolute inset-0 grid place-content-center opacity-0 transition duration-200 ease-in-out group-hover/image:bg-black/50 group-hover/image:opacity-100">
              <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
            </span>
          </>
        )}
      </Show>
    </button>
  )
}
