import { NavigationAppAccount } from "@/components/blocks/navigation-app/navigation-app-account"
import { NavigationMenu } from "@/components/panelui/navigation-menu"
import { Show } from "@/components/utility/show"
import type { SessionUser } from "@/lib/auth-client"
import { Link } from "@tanstack/react-router"

type NavigationAppProps = {
  /**
   * Session user resolved by the route loader. It drives the account avatar
   * and reveals the admin menu for `ADMIN` roles.
   */
  user?: SessionUser | null
}

export function NavigationApp({ user }: NavigationAppProps) {
  return (
    <NavigationMenu
      variant="bar"
      aria-label="wuwa-builds"
      className="sticky inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <NavigationMenu.Brand className="ps-2">
        <Link to="/">Wuwa Builds</Link>
      </NavigationMenu.Brand>
      <NavigationMenu.List>
        <NavigationMenu.Item value="wiki">
          <NavigationMenu.Trigger>Wiki</NavigationMenu.Trigger>
          <NavigationMenu.Content className="grid w-full gap-1 md:grid-cols-2">
            <NavigationMenu.Link
              render={<Link to="/" />}
              description="Estadísticas, habilidades y elemento de cada resonador"
            >
              Resonadores
            </NavigationMenu.Link>
            <NavigationMenu.Link
              render={<Link to="/" />}
              description="Tipo, rareza y pasiva de cada arma"
            >
              Armas
            </NavigationMenu.Link>
            <NavigationMenu.Link
              render={<Link to="/" />}
              description="Coste, clase y sonata de cada eco"
            >
              Ecos
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <Show when={user?.role === "ADMIN"}>
          <NavigationMenu.Item value="admin">
            <NavigationMenu.Trigger>Admin</NavigationMenu.Trigger>
            <NavigationMenu.Content className="grid w-full gap-1 md:grid-cols-2">
              <NavigationMenu.Link
                render={<Link to="/admin" />}
                description="Accesos directos a resonadores, armas y ecos"
              >
                Panel
              </NavigationMenu.Link>
              <NavigationMenu.Link
                render={<Link to="/admin/resonators" />}
                description="Crea y edita los resonadores del catálogo"
              >
                Resonadores
              </NavigationMenu.Link>
              <NavigationMenu.Link
                render={<Link to="/admin/weapons" />}
                description="Crea y edita las armas del catálogo"
              >
                Armas
              </NavigationMenu.Link>
              <NavigationMenu.Link
                render={<Link to="/admin/echoes" />}
                description="Crea y edita los ecos del catálogo"
              >
                Ecos
              </NavigationMenu.Link>
              <NavigationMenu.Link
                render={<Link to="/admin/echoes/sonatas" />}
                description="Asocia ecos y define sus efectos de sonata"
              >
                Efecto de sonata
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </Show>
        <NavigationMenu.Item value="builder">
          <NavigationMenu.Trigger>Builder</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link
              render={<Link to="/" />}
              description="Explora las builds compartidas por la comunidad"
            >
              Builds
            </NavigationMenu.Link>
            <NavigationMenu.Link
              render={<Link to="/panel/my-builds" />}
              description="Crea y administra tus builds guardadas"
            >
              Mis builds
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Actions className="ms-auto">
        <NavigationAppAccount user={user} />
      </NavigationMenu.Actions>
    </NavigationMenu>
  )
}
