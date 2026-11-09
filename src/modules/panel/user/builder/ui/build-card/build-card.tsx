import { Card } from "@/components/ui/card"
import { cn } from "cn"
import { cva, type VariantProps } from "class-variance-authority"

export const buildCardVariants = cva("bg-card/50 backdrop-blur-3xl", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    rounded: {
      default: "",
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2-xl": "rounded-2xl",
      "4-xl": "rounded-4xl",
    },
    hovered: {
      true: "transition-colors duration-200 ease-in-out hover:bg-card/70",
      false: "",
    },
  },
  defaultVariants: {
    padding: "md",
    rounded: "default",
    hovered: false,
  },
})

type BuildCardProps = React.ComponentProps<typeof Card> &
  VariantProps<typeof buildCardVariants>

/** Styled card surface shared by the build card and its sections. */
function BuildCard({
  className,
  padding,
  rounded,
  hovered,
  ...props
}: BuildCardProps) {
  return (
    <Card
      className={cn(
        buildCardVariants({ padding, rounded, hovered }),
        className
      )}
      {...props}
    />
  )
}

export { BuildCard, type BuildCardProps }
