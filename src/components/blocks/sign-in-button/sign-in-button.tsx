import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"
import { toast } from "sonner"

type SignInProvider = "discord" | "google"

interface SignInButtonProps {
  children: React.ReactNode
  provider: SignInProvider
}

export function SignInButton({ children, provider }: SignInButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignIn = () => {
    startTransition(async () => {
      try {
        const result = await authClient.signIn.social({
          provider: provider,
          callbackURL: "/",
        })

        if (result.error) {
          toast.error("Sign in failed.")
        }
      } catch {
        toast.error("Sign in failed.")
      }
    })
  }

  return (
    <Button disabled={isPending} onClick={handleSignIn}>
      {children}
    </Button>
  )
}
