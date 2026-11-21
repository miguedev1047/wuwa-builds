import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { authClient } from "@/lib/auth-client"
import { DiscordLogoIcon } from "@phosphor-icons/react"
import { useTransition } from "react"

const SIGN_IN_LABEL = "Iniciar sesión con Discord"

/** Opens Discord OAuth and returns the authenticated user to the panel. */
export function DiscordSignInButton() {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()

  const signIn = () => {
    startTransition(async () => {
      try {
        const result = await authClient.signIn.social({
          provider: "discord",
          callbackURL: "/panel",
        })

        if (result.error) throw result.error
      } catch {
        toast.add({
          title: "No se pudo iniciar sesión con Discord",
          description: "Inténtalo de nuevo.",
          type: "destructive",
        })
      }
    })
  }

  return (
    <Button
      size="lg"
      loading={isPending}
      aria-label={SIGN_IN_LABEL}
      className="h-auto min-h-11 w-full px-3 py-2 text-sm font-semibold whitespace-normal sm:px-5 sm:text-base [&_svg:not([class*=size-])]:size-5"
      onClick={signIn}
    >
      <DiscordLogoIcon aria-hidden="true" weight="fill" />
      {SIGN_IN_LABEL}
    </Button>
  )
}
