import { Avatar } from "@/components/panelui/avatar"
import { Button } from "@/components/panelui/button"
import { Menu } from "@/components/panelui/menu"
import { useToast } from "@/components/panelui/toast"
import { Show } from "@/components/utility/show"
import { LogoutIcon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { authClient, type SessionUser } from "@/lib/auth-client"
import { Link, useNavigate } from "@tanstack/react-router"
import { useTransition } from "react"

type NavigationAppAccountProps = {
  /** Session user; without it the account area offers sign in instead. */
  user?: SessionUser | null
}

/** Account area of the app navigation: sign in, or the user menu. */
export function NavigationAppAccount({ user }: NavigationAppAccountProps) {
  const toast = useToast()
  const [isSigningOut, startSignOut] = useTransition()

  const navigate = useNavigate()

  const handleSignOut = () => {
    startSignOut(async () => {
      try {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              navigate({ to: "/" })
              toast.add({ title: "Cerrando sesión...", type: "success" })
            },
          },
        })
      } catch {
        toast.add({
          title: "No se pudo cerrar la sesión.",
          type: "destructive",
        })
      }
    })
  }

  return (
    <Show
      when={user}
      fallback={
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link to="/auth/login" />}
        >
          Iniciar sesión
        </Button>
      }
    >
      {(current) => (
        <Menu>
          <Menu.Trigger
            aria-label="Menú de cuenta"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar
              alt={current.name}
              src={current.image ?? undefined}
              name={current.name}
              size="sm"
            />
          </Menu.Trigger>
          <Menu.Content align="end">
            <Menu.Item render={<Link to="/" />}>
              <HugeiconsIcon icon={UserIcon} />
              Mi perfil
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item
              variant="destructive"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              <HugeiconsIcon icon={LogoutIcon} />
              {isSigningOut ? "Cerrando sesión" : "Cerrar sesión"}
            </Menu.Item>
          </Menu.Content>
        </Menu>
      )}
    </Show>
  )
}
