import { createHash } from "node:crypto"
import { readFileSync, readdirSync } from "node:fs"
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
const DATA_DIRECTORIES = [
  "./src/data/wuwa-resonators",
  "./src/data/wuwa-catalogs",
]

function readDataVersion(): string {
  const hash = createHash("sha256")

  for (const directory of DATA_DIRECTORIES) {
    const directoryUrl = new URL(`${directory}/`, import.meta.url)
    hash.update(`${directory}\0`)

    try {
      const files = readdirSync(directoryUrl, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name)
        .sort()

      for (const file of files) {
        hash.update(`${file}\0`)
        hash.update(readFileSync(new URL(file, directoryUrl)))
      }
    } catch {
      // Missing data directories are ignored during initial setup.
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
