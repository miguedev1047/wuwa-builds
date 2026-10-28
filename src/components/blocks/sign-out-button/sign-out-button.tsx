import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"
import { toast } from "sonner"

interface SignOutButtonProps extends React.ComponentProps<typeof Button> {}

export function SignOutButton({ ...props }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await authClient.signOut()
      } catch {
        toast.error("Sign out failed.")
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
