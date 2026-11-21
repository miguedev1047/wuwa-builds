import { landingBackgrounds } from "@/assets/landing"
import { LandingPage } from "@/routing/home/landing/landing-page"
import { createFileRoute } from "@tanstack/react-router"

const title = "Wuwa Builds | Creador de builds de Wuthering Waves"
const description =
  "Crea builds de Wuthering Waves en español. Elige resonadores, configura armas y ecos, calcula sus estadísticas y guarda tus variantes."

export const Route = createFileRoute("/_navigation/")({
  component: LandingRoute,
  loader: () => ({
    background:
      landingBackgrounds[Math.floor(Math.random() * landingBackgrounds.length)],
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es" },
      { property: "og:site_name", content: "Wuwa Builds" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      {
        property: "og:image:alt",
        content: "Build de Cartethyia en Wuwa Builds",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
})

function LandingRoute() {
  const { background } = Route.useLoaderData()
  return <LandingPage background={background} />
}
