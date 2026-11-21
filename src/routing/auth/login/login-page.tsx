import { RouteNavigation } from "@/components/blocks/route-navigation"
import { LoginBackground } from "@/modules/login/presentation/components/login-background"
import { LoginCard } from "@/modules/login/presentation/components/login-card"

/** Sign-in page with one primary action. */
export function LoginPage() {
  return (
    <main aria-labelledby="login-title">
      <RouteNavigation.Root
        variant="extended"
        className="relative isolate grid min-h-svh place-items-center space-y-0 overflow-hidden bg-black p-6"
      >
        <LoginBackground />
        <RouteNavigation.Content className="relative flex justify-center">
          <LoginCard />
        </RouteNavigation.Content>
      </RouteNavigation.Root>
    </main>
  )
}
