import { cn } from "cn"

type BuildCardTriggerProps = React.ComponentProps<"button">

/** Full-card button that opens a section dialog or a catalog picker. */
export function BuildCardTrigger({
  className,
  ...props
}: BuildCardTriggerProps) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "block h-full w-full border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    />
  )
}
