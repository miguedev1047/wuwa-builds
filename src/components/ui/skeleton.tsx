import { cn } from "cn"

type SkeletonProps =
  | ({ as?: "div" } & React.ComponentProps<"div">)
  | ({ as: "span" } & React.ComponentProps<"span">)

/** Loading placeholder, with an inline element for use inside text. */
function Skeleton(props: SkeletonProps) {
  const className = cn(
    "animate-pulse rounded-2xl bg-muted-foreground/10",
    props.className
  )

  if (props.as === "span") {
    const { as: Element, ...spanProps } = props
    return <Element data-slot="skeleton" {...spanProps} className={className} />
  }

  const { as: Element = "div", ...divProps } = props
  return <Element data-slot="skeleton" {...divProps} className={className} />
}

export { Skeleton }
