import { Card } from "@/components/panelui/card"
import { DiscordSignInButton } from "@/modules/login/presentation/components/discord-sign-in-button"

/** Introduces the sign-in action on a translucent surface. */
export function LoginCard() {
  return (
    <Card variant="glass" className="w-full max-w-md">
      <Card.Header className="gap-2 px-6 pt-6 pb-4 text-center sm:px-8 sm:pt-8">
        <Card.Title as="h1" id="login-title" className="text-3xl text-balance">
          Inicia sesión
        </Card.Title>
        <Card.Description className="text-pretty text-card-foreground/80">
          Guarda tus builds y retómalas cuando quieras.
        </Card.Description>
      </Card.Header>
      <Card.Content className="sm:px-8 sm:pb-8">
        <DiscordSignInButton />
      </Card.Content>
    </Card>
  )
}
