import { SignInButton } from "@/components/blocks/sign-in-button"
import { DiscordIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function LoginCard() {
  return (
    <main className="flex h-screen w-full items-center justify-center overflow-hidden">
      <div>
        <SignInButton provider="discord">
          <HugeiconsIcon icon={DiscordIcon} />
          Sign in With Discord
        </SignInButton>
      </div>
    </main>
  )
}
