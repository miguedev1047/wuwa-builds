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
 * Resonator dataset version: hash of the scraped `index.json`.
 *
 * It changes with every deployed scrape, so query keys (and a future persistent
 * cache such as TanStack DB / SQLite) invalidate on their own. It is computed
 * at build time; after re-scraping, restart the dev server.
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
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    redact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
