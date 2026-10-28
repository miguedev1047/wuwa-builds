import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { redact } from "@tanstack/redact/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"

/**
 * Versión del dataset de resonadores: hash del `index.json` scrapeado.
 *
 * Cambia con cada scrape desplegado, así que las query keys (y una futura
 * caché persistente tipo TanStack DB / SQLite) se invalidan solas. Se calcula
 * en build; tras re-scrapear hay que reiniciar el dev server.
 */
function readDataVersion(): string {
  try {
    const index = readFileSync(
      new URL("./src/data/wuwa-resonators/index.json", import.meta.url)
    )
    return createHash("sha256").update(index).digest("hex").slice(0, 12)
  } catch {
    return "dev"
  }
}

const config = defineConfig({
  define: {
    "import.meta.env.VITE_WUWA_DATA_VERSION": JSON.stringify(readDataVersion()),
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    redact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
