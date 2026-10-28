import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { redact } from "@tanstack/redact/vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"

/**
 * Dataset version: hash of the scraped JSON that the runtime serves.
 *
 * It changes with every deployed scrape, so query keys (and a future persistent
 * cache such as TanStack DB / SQLite) invalidate on their own. It is computed
 * at build time; after re-scraping, restart the dev server.
 */
const DATA_FILES = [
  "./src/data/wuwa-resonators/index.json",
  "./src/data/wuwa-catalogs/weapons.json",
  "./src/data/wuwa-catalogs/echoes.json",
  "./src/data/wuwa-catalogs/echo-sets.json",
]

function readDataVersion(): string {
  const hash = createHash("sha256")

  for (const file of DATA_FILES) {
    try {
      hash.update(readFileSync(new URL(file, import.meta.url)))
    } catch {
      // Missing files are ignored; the version still changes when they appear.
    }
  }

  return hash.digest("hex").slice(0, 12)
}

const config = defineConfig({
  define: {
    "import.meta.env.VITE_WUWA_DATA_VERSION": JSON.stringify(readDataVersion()),
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    redact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
