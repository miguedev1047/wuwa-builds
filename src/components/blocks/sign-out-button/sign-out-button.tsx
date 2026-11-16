import { Button } from "@/components/panelui/button"
import { Spinner } from "@/components/panelui/spinner"
import { useToast } from "@/components/panelui/toast"
import { Show } from "@/components/utility/show"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"

type SignOutButtonProps = React.ComponentProps<typeof Button>

export function SignOutButton({ ...props }: SignOutButtonProps) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await authClient.signOut({
          callbackURL: "/",
        })
      } catch {
        toast.add({ title: "Sign out failed.", type: "destructive" })
      }
    })
  }

  return (
    <Button
      disabled={isPending}
      variant="outline"
      onClick={handleSignOut}
      {...props}
    >
      <Show when={isPending}>
        <Spinner />
      </Show>
      Sign out
    </Button>
  )
}
