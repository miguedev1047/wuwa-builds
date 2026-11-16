import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"

type SignInProvider = "discord" | "google"

interface SignInButtonProps {
  children: React.ReactNode
  provider: SignInProvider
}

export function SignInButton({ children, provider }: SignInButtonProps) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()

  const handleSignIn = () => {
    startTransition(async () => {
      try {
        const result = await authClient.signIn.social({
          provider: provider,
          callbackURL: "/panel",
        })

        if (result.error) {
          toast.add({ title: "Sign in failed.", type: "destructive" })
        }
      } catch {
        toast.add({ title: "Sign in failed.", type: "destructive" })
      }
    })
  }

  return (
    <Button disabled={isPending} onClick={handleSignIn}>
      {children}
    </Button>
  )
}
