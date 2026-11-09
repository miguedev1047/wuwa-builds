import { Image } from "@/components/ui/image"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import { cn } from "cn"
import { buildCatalogPickerItemVariants } from "./build-catalog-picker-variants"

type BuildCatalogPickerItemProps = {
  label: string
  image?: string
  aspect?: "square" | "portrait"
  selected?: boolean
  disabled?: boolean
  pending?: boolean
  onSelect: () => void
  className?: string
}

/** Image button with tooltip and selected state used by every catalog picker. */
export function BuildCatalogPickerItem({
  label,
  image,
  aspect = "square",
  selected = false,
  disabled = false,
  pending = false,
  onSelect,
  className,
}: BuildCatalogPickerItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            aria-pressed={selected}
            aria-busy={pending}
            disabled={disabled || pending}
            data-selected={selected}
            onClick={onSelect}
            className={cn(
              buildCatalogPickerItemVariants({ selected }),
              className
            )}
          >
            <Show
              when={image}
              fallback={
                <div
                  className={cn(
                    "flex size-full items-center justify-center bg-accent text-xs text-muted-foreground",
                    aspect === "portrait" ? "aspect-2/3" : "aspect-square"
                  )}
                >
                  {label.slice(0, 1)}
                </div>
              }
            >
              {(src) => (
                <Image
                  src={src}
                  alt={label}
                  aspect={aspect}
                  background="accent"
                  size="full"
                  rounded="xl"
                  hover="zoom"
                />
              )}
            </Show>

            <Show when={pending}>
              <span className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Spinner />
              </span>
            </Show>
          </button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
